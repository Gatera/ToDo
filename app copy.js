const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

// MongoDB connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

//DB Schema
const itemsSchema = new mongoose.Schema ({
  name: String
});

//DB Model
const Item = mongoose.model("Item", itemsSchema);

let day = date.getDate();
let items = ["Buy Food","Cook Food", "Eat Food"];
let workItems = [];

let title = "General";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("list", {
    kindOfDay: day, newItems: items, listTitle: title
  });

});

app.post("/", function(req, res) {
  let item = req.body.newItem;

  if (req.body.formTitle === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
  items.push(item);
  res.redirect("/");
}
});

app.get("/work", function(req, res) {
  title = "Work";
  res.render("list", {kindOfDay: day, newItems: workItems, listTitle: title});
});

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
