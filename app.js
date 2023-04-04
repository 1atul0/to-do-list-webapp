const express = require("express");
const bodyParser = require("body-parser"); //for getting data from post method of html form
const date = require(__dirname + "/date.js");
// console.log(date);it simply show function name
// console.log(date())//it calle the function written in date.js
const app = express();



app.use(bodyParser.urlencoded({ extended: true })); //for using body parser must add thid line
app.use("/public", express.static("public")); //you must write this line for using css file and add css file in public folder



let items = ["Buy food", "take bath", "take rest"];
let workItems = [];



app.set("view engine", "ejs"); //for using ejs


app.get("/", function (req, res) {
  let day = date.getDate();
  res.render("list", { listTitle: day, newListItems: items }); //syntax for sending value to kindOfDay to list.ejs file
});


app.post("/list", function (req, res) {
  //post come from html form
  let item = req.body.newItem;
  if (req.body.button === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/"); //redirect to app.get("/",function(req,res));
  }
  // console.log(item);
  // console.log(req.body);
});



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
