/* These lines of code are importing necessary modules for the Node.js application. */
const express = require("express");
const bodyParser = require("body-parser"); //for getting data from post method of html form
const date = require(__dirname + "/date.js");
const _ = require("lodash"); //for making kebabcash words
// console.log(date);it simply show function name
// console.log(date())//it calle the function written in date.js
/* These lines of code are importing necessary modules for the Node.js application. The `express`
module is used to create a web server and handle HTTP requests and responses. The `mongoose` module
is used to connect to a MongoDB database and perform database operations. The `const` keyword is
used to declare constants `app` and `mongoose` that will hold the imported modules. */
const app = express();
const mongoose = require("mongoose");

/* `app.use(bodyParser.urlencoded({ extended: true }));` is middleware that is used to parse the
incoming request bodies in a URL-encoded format. It is used to extract the form data from the
request body and make it available in `req.body` object. */
app.use(bodyParser.urlencoded({ extended: true })); //for using body parser must add thid line
app.use("/public", express.static("public")); //you must write this line for using css file and add css file in public folder

//for the adding mongoose database in server
//make connection to database
/* This code is connecting the Node.js application to a MongoDB database named "todolistDB" running on
the local machine at port 27017. The `mongoose` module is used to connect to the database and
perform database operations. The `useNewUrlParser` and `useUnifiedTopology` options are used to
avoid deprecation warnings. The `then()` method is used to log a message to the console if the
connection is successful, and the `catch()` method is used to log an error message to the console if
the connection fails. */
mongoose
  .connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.error(err));

//making itemschema for todolistDb
/* This code is creating a schema for the items that will be stored in the MongoDB database. The schema
defines the structure of the data that will be stored in the database. In this case, the schema has
only one field called "name" which is of type String and is required. The "required" option
specifies that the "name" field must be present in every item that is stored in the database. The
second argument to the "required" option is an error message that will be displayed if the "name"
field is missing. */
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please give name"],
  },
});

//making modal or collection for todolistDB
/* `const Item = mongoose.model("Item", itemsSchema)` is creating a Mongoose model named "Item" based
on the `itemsSchema` schema. This model will be used to perform CRUD (Create, Read, Update, Delete)
operations on the "items" collection in the "todolistDB" database. The `Item` model will have
methods like `find()`, `save()`, `updateOne()`, `deleteOne()`, etc. that can be used to interact
with the database. */
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

//for using ejs,you must add all ejs file in views directory
/* `app.set("view engine", "ejs");` is setting the view engine for the Node.js application to EJS
(Embedded JavaScript). This means that the application will use EJS to render dynamic HTML pages.
The `view engine` setting is used by the `res.render()` method to render the EJS templates. */
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
              "default items are added"
            )
          )
          .catch((err) => console.error(err));
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems }); //syntax for sending value to kindOfDay to list.ejs file
      }
    })
    .catch((err) => console.error(err));
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
      .then(() => console.log(" inserted by user in item collection of db"))
      .catch((err) => console.error(err));
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      // console.log(foundList.items.push(item));
      foundList.items.push(item);
      foundList
        .save()
        .then(() =>
          console.log(
            "inserted by user in list collection of name : " + listName
          )
        )
        .catch((err) => console.error(err));
      res.redirect("/" + listName);
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
      .then(() =>
        console.log(" deleted checkboxed item from item collection")
      )
      .catch((err) => console.error(err));
    //after delete you must refresh your page so redirect
    res.redirect("/");
  } //items belong from custome listname ,use else condition
  //this is method to delete item from array of findoneandupdate
  else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then(() => console.log(" deleted item from list of name : " + listName))
      .catch((err) => console.error(err));
    res.redirect("/" + listName);
  }
});

// //route for workitems
// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

/* This code is defining a route for a custom list name in the Node.js application. The `app.get()`
method is used to define a GET request handler for a URL path that includes a parameter
`:customeListName`. When a GET request is made to this URL path, the callback function is executed.
The `req.params` object is used to extract the value of the `:customeListName` parameter from the
URL path and assign it to a variable `customeListName`. This variable can then be used to perform
database operations or render a dynamic HTML page based on the custom list name. */
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
              console.log("opened a new custome list name : " + customeListName)
            )
            .catch((err) => console.error(err));
          //after save must redirect for change in your website
          res.redirect("/" + customeListName);
        } else {
          //show an existing list
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items,
          });
        }
      })
      .catch((err) => console.error(err));
  }
});

// app.post("/work", function (req, res) {
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// });

// app.get("/about", function (req, res) {
//   res.render("about");
// });

/* `app.listen(3000, function () { console.log("server is running on port 3000"); });` is starting the
Node.js application and listening for incoming HTTP requests on port 3000. When a request is
received, the callback function is executed and a message "server is running on port 3000" is logged
to the console. This message indicates that the server is up and running and ready to handle
requests. */
app.listen(3000 || process.env.PORT, function () {
  console.log("server is running on port 3000");
});
