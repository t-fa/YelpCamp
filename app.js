var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB = require("./seeds");

//seedDB();
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



// Campground.create(
// 	{
// 		name: "Granite Hill", 
// 		image: "https://images.unsplash.com/photo-1477952714812-f98f707e52b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
// 		description: "This is a huge granite hill. No bathrooms. No water. Beautiful granite!"
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("Newly created campground: ");
// 			console.log(campground);
// 		}
// 	});

// var campgrounds = [
// 		{name: "Salmon Creek", image: "https://pixabay.com/get/54e5d4414356a814f6da8c7dda793f7f1636dfe2564c704c73287ad4914ccd58_340.jpg"},
// 		{name: "Granite Hill", image: "https://pixabay.com/get/57e4d64a4a54ad14f6da8c7dda793f7f1636dfe2564c704c73287ad4914ccd58_340.jpg"},
// 		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/55e7d24a485aac14f6da8c7dda793f7f1636dfe2564c704c73287ad4914ccd58_340.jpg"}
// 	]

app.get("/", function(req, res){
	res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

// CREATE - add new campground to db
app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	console.log("Description: ");
	console.log(desc);
	var newCampground = {name: name, image: image, description: desc};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			console.log("New campground: ");
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// ===============
// COMMENTS routes
// ===============

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.listen(3000, process.env.IP, function(){
	console.log("Server is running");
});