const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = ["Buy Food","Cook Food", "Eat Food"];
let work = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };

  let day = today.toLocaleDateString("en-US", options);
  let title = "General";

  res.render("list", {
    kindOfDay: day, newItems: items, listTitle: title
  });

});

app.get("/work", function(req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };

  let day = today.toLocaleDateString("en-US", options);

  let title = "Work";

  res.render("list", {kindOfDay: day, newItems: work, listTitle: title});
});

app.post("/", function(req, res) {
  let item = req.body.newItem;

  items.push(item);

  res.redirect("/");
});

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  work.push(item);
  res.redirect("/work");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
