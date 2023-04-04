//written in anonymous function but can be written like this 
// module.exports.getDate=getDate;
// then declare getDate function like getDay() function
module.exports.getDate=function()
{
  let today=new Date();
  // let currentDate=today.getDay();
  // let daysName=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // let day=daysName[currentDate];
  // console.log(day);
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };//for using time data ij js
  return today.toLocaleDateString("en-US",options);
  // console.log(today.toLocaleDateString("en-US")); // 9/17/2016
  // console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
  // console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016

}

module.exports.getDay=getDay;
function getDay()
{
  let today=new Date();
  // let currentDate=today.getDay();
  // let daysName=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // let day=daysName[currentDate];
  // console.log(day);
  let options = { weekday: 'long'};//for using time data ij js
  return today.toLocaleDateString("en-US",options);
  // console.log(today.toLocaleDateString("en-US")); // 9/17/2016
  // console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
  // console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016
}
