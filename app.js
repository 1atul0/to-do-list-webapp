/* These lines of code are importing necessary modules for the Node.js application. */
const express = require("express");
const bodyParser = require("body-parser"); //for getting data from post method of html form
const date = require(__dirname + "/date.js");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path"); //for using relative path for public folder
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGODB_URI, {
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.error(err));

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please give name"],
  },
});

const Item = mongoose.model("Item", itemsSchema);

// make some data for putting in db in Item collection
const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to aff a new item. ",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

//make array of items
const defaultItems = [item1, item2, item3];

//makking schema for custom route listname
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

//making model for custom route listname
const List = mongoose.model("List", listSchema);

app.get("/err",(req,res)=>{
  res.render("error");
})


app.get("/", function (req, res) {
  let day = date.getDate();
  //find data from todolistDB
  Item.find()
    .then((foundItems) => {
      if (foundItems.length == 0) {
        //insert in Item collection of todolistDB
        Item.insertMany(defaultItems)
          .then(() => res.redirect("/"))
          .catch((err) => {
            res.render("error");
          });

      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems }); //syntax for sending value to kindOfDay to list.ejs file
      }
    })
    .catch((err) => res.render("error"));
});

app.post("/list", function (req, res) {
  //post come from html form
  //itemName take value from form input whose name is newItem
  let itemName = req.body.newItem;
  const listName = req.body.list;
  //make a object of model Item
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    //save that item in Item collection of todolistDB
    //this is syntax for saving items in db
    item
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => res.render("error"));
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      // console.log(foundList.items.push(item));
      foundList.items.push(item);
      foundList
        .save()
        .then(() => {
          // console.log(
          //   "inserted by user in list collection of name : " + listName
          // )
          res.redirect("/" + listName);
        }
        )
        .catch((err) => res.render("error"));
    });
  }
});

//when checkbox of item is checked
app.post("/delete", function (req, res) {
  //take id of checked item
  const checkedItemId = req.body.checkbox;
  //take list of checked items
  const listName = req.body.listName;
  //if item belongs to home route,page then remove accordingly if condition is true
  if (listName === "Today") {
    //delete that id from database
    Item.findByIdAndRemove({ _id: checkedItemId })
      .then(() => {

        // console.log(" deleted checkboxed item from item collection")
        res.redirect("/");
      }
      )
      .catch((err) => res.render("error"));
    }
  else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then(() => {
        console.log(" deleted item from list of name : " + listName)
        res.redirect("/" + listName);
      })
      .catch((err) => {
        res.redirect("/err");
      });
  }
});


app.get("/:customeListName", function (req, res) {
  const customeListName = _.capitalize(req.params.customeListName);
  if (customeListName != "Favicon.ico") {
    //find data from custom list if present in before or not
    List.findOne({ name: customeListName })
      .then((foundList) => {
        if (!foundList) {
          //create a new list if not already made
          const list = new List({
            name: customeListName,
            items: defaultItems,
          });
          list
            .save()
            .then(() =>
              // console.log("opened a new custome list name : " + customeListName)
              res.redirect("/" + customeListName)
            )
            .catch((err) => res.render("error"));
          //after save must redirect for change in your website

        } else {
          //show an existing list
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items,
          });
        }
      })
      .catch((err) => res.render("error"));
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`server is running on port ${port}`);
});
