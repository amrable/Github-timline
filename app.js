//jshint esversion:6

const express = require('express');
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const request = require('request');
const _ = require('lodash');

var port = process.env.PORT || 3000;

var obj=[{
  name: "Enter your github username to animate your repos.",
  html_url: "/"
}];
var user={
  data: "Enter your github username to see your summary.",
  avatar : "",
  profile: "",
  forks: 0 ,
  watchers: 0 ,
  num_repo: 0
};
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(port, function() {
  console.log('Server started on port 3000');
});


app.get("/", function(req, res) {

  obj=[{
    name: "Enter your github username to animate your repos.",
    html_url: "/"
  }];

  var user={
    data: "Enter your github username to see your summary.",
    avatar : "",
    profile: "",
    forks: 0 ,
    watchers: 0 ,
    num_repo: 0
  };
  res.render("home", {

      repos: obj,
      account: user

    });

});

app.post("/", function(req, res) {

  const username = req.body.username;

  const  url= 'https://api.github.com' + '/users/' + username + '/repos';


  request({url: url, headers: {'user-agent': 'node.js'} }, function(error, response, data) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    if(response.statusCode===200){
       obj= JSON.parse(data);
       user.avatar=obj[0].owner.avatar_url;
       user.profile=obj[0].owner.html_url;
       user.num_repo=obj.length;
       user.forks=0;
       user.watchers=0;
       user.data=obj[0].owner.login;
      for(var i=0;i<obj.length;i++){

        obj[i].language=_.toLower(obj[i].language);

      if(obj[i].language=="html")obj[i].language="html5";
      if(obj[i].language=="css")obj[i].language="css3";
      if(obj[i].language=="c++")obj[i].language="cplusplus";
      user.forks+=obj[i].forks_count;
      user.watchers+=obj[i].watchers_count;



      }

      res.render("home", {

          repos: obj,
          account:user

        });

    }else if (response.statusCode===404){
      user.profile="error";
      res.render("home", {

          repos: obj,
          account:user

        });
    }

  });




});

app.get("/reset",function(req,res){
  console.log("hey");

  obj=[{
    name: "Enter your github username to animate your repos.",
    html_url: "/"
  }];
  user={
    data: "Enter your github username to see your summary.",
    avatar : "",
    profile: "",
    forks: 0 ,
    watchers: 0 ,
    num_repo: 0
  };
  res.render("home", {

      repos: obj,
      account:user

    });
});
