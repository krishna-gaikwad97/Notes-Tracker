const express = require("express");
const app = express();
const port = 3000;
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/notesApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Define Schema and Model
const Post = require("./model.js");
// ✅ Middleware setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Hello, MongoDB + Express!");
});

// Get all posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.render("index.ejs", { posts });
});

// Form to create new post
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// Create new post
app.post("/posts", async (req, res) => {
  const { name, content, notes } = req.body;
  await Post.create({ name, content, notes });
  res.redirect("/posts");
});

// Show single post
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render("show.ejs", { post });
});

// Form to edit a post
app.get("/posts/:id/edit", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render("edit.ejs", { post });
});

// Update a post
app.patch("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const newContent = req.body.notes;
  await Post.findByIdAndUpdate(id, { notes: newContent });
  res.redirect("/posts");
});

// Delete a post
app.delete("/posts/:id/delete", async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect("/posts");
});
