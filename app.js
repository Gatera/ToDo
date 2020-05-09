const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

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

const item1 = new Item ({
  name: "Welcome to your to do list!"
});

const item2 = new Item ({
  name: "Click the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Click this to check off an item."
});

const defaultItems = [item1, item2, item3];

//DB Model END

//DB collection work
const listSchema = {name: String, items: [itemsSchema]};
const List = mongoose.model("List", listSchema);

let title = "General";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  Item.find(function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Yaay!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {kindOfDay: "Today", newItems: foundItems, listTitle: title});
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.formTitle;

  const itemN = new Item ({
    name: itemName
  });

  if (listName === "General") {
    itemN.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(itemN);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.get("/:customList", function(req, res) {
  const listCategory = _.capitalize(req.params.customList);
  const capitalListCategory = _.capitalize(listCategory);

  List.findOne({name: listCategory}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new list
        const list = new List({
          name: listCategory,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + listCategory);
      } else {
        //Show existing list
        res.render("list", {kindOfDay: "Today", newItems: foundList.items, listTitle: foundList.name});
      }
    }
  });

});

app.post("/delete", function(req, res) {
  const checked = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "General") {
    Item.findByIdAndRemove(checked, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Removed");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checked}}}, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      } else {
        console.log(err);
      }
    });
  }

});

// app.get("/work", function(req, res) {
//   title = "Work";
//   res.render("list", {kindOfDay: "Today", newItems: workItems, listTitle: title});
// });
//
// app.post("/work", function(req, res) {
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// });

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
