const express = require("express");
const bodyParser = require("body-parser"); //for getting data from post method of html form
const date = require(__dirname + "/date.js");
// console.log(date);it simply show function name
// console.log(date())//it calle the function written in date.js
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true })); //for using body parser must add thid line
app.use("/public", express.static("public")); //you must write this line for using css file and add css file in public folder

//for the adding mongoose database in server
//make connection to database
mongoose
  .connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.error(err));

//making itemschema for todolistDb
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please give name"],
  },
});

//making modal or collection for todolistDB
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

//for using ejs,you must add all ejs file in views directory
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let day = date.getDate();
  //find data from todolistDB
  Item.find()
    .then((foundItems) => {
      if (foundItems.length == 0) {
        //insert in Item collection of todolistDB
        Item.insertMany(defaultItems)
          .then(() =>
            console.log(
              "successfully inserted in Item collection of todolistDB"
            )
          )
          .catch((err) => console.error(err));
        res.redirect("/");
      } else {
        res.render("list", { listTitle: day, newListItems: foundItems }); //syntax for sending value to kindOfDay to list.ejs file
      }
    })
    .catch((err) => console.error(err));
});

app.post("/list", function (req, res) {
  //post come from html form
  //itemName take value from form input whose name is newItem
  let itemName = req.body.newItem;
  //make a object of model Item
  const item = new Item({
    name: itemName,
  });
  //save that item in Item collection of todolistDB
  //this is syntax for saving items in db
  item
    .save()
    .then(() => console.log("successfully inserted by user in db"))
    .catch((err) => console.error(err));
  res.redirect("/");
});

//when checkbox of item is checked
app.post("/delete", function (req, res) {
  //take id of checked item
  const checkedItemId = req.body.checkbox;
  //delete that id from database
  Item.findByIdAndRemove({ _id: checkedItemId })
    .then(() => console.log("succesfully deleted checkbox item"))
    .catch((err) => console.error(err));
  //after delete you must refresh your page so redirect
  res.redirect("/");
});

//route for workitems
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
