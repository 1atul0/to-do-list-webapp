const express=require("express");
const bodyParser=require("body-parser");//for getting data from post method of html form
const app=express();
app.use(bodyParser.urlencoded({extended:true}));//for using body parser must add thid line
app.use("/public",express.static("public"));//you must write this line for using css file and add css file in public folder
let items=['Buy food','take bath','take rest'];
let workItems=[];
app.set("view engine",'ejs');//for using ejs  
app.get("/",function(req,res){
  let today=new Date();
  // let currentDate=today.getDay();
  // let daysName=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // let day=daysName[currentDate];
  // console.log(day);
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };//for using time data ij js
  let day=today.toLocaleDateString("en-US",options);
  // console.log(today.toLocaleDateString("en-US")); // 9/17/2016
  // console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
  // console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016
  res.render("list",{listTitle:day,newListItems:items});//syntax for sending value to kindOfDay to list.ejs file
});
app.post("/list",function(req,res){//post come from html form
  let item=req.body.newItem;
  if(req.body.button==='Work')
  {
    workItems.push(item);
    res.redirect("/work");
  }
  else
  {
    items.push(item);
    res.redirect("/");//redirect to app.get("/",function(req,res));
  }
  // console.log(item);
  console.log(req.body);
});
app.get("/work",function(req,res)
{
  res.render("list",{listTitle:'Work List',newListItems:workItems});
});
app.post("/work",function(req,res){
  let item=req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});
app.get("/about",function(req,res){
  res.render("about");
})

app.listen(3000,function(){
  console.log("server is running on port 3000");
});