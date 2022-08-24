//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const homeStartingContent = " Holaa!! Want to read a blog of your interest? Want to write your own blog and share it with the world? You are at the perfect place, go ahead!! Explore ~Daily Journal~ blog website and have fun ;)";
const aboutContent = " Hii, I am Gunjan Gupta, sophomore at Maharaja Surajmal Institute of Technology pursuing Computer Science and Engineering. I am a tech enthusiast. Welcome you all to my blog website.";
const contactContent = " Fill the following form to reach out to me";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.CONNECTION_STRING);

const postSchema = {
  title: String,
  content: String
};

const dataSchema ={
  firstName: String,
  lastName: String,
  country: String,
  subject: String
}

const Post = mongoose.model("Post", postSchema);
const Data = mongoose.model("Data", dataSchema);

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  }); 


  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.post("/contact", function(req, res){
  const data = new Data({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    country: req.body.country,
    subject: req.body.subject
  }); 
 
  data.save(function (err) {
    if (!err) {
      console.log("Successfully submitted your response.");
      res.redirect("/");
    }
  });

})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
