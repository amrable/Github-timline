//jshint esversion:6

const express = require('express');
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const request = require('request');
const _ = require('lodash');

var port = process.env.PORT || 3000;

var obj = [{
  name: "Enter your github username to animate your repos.",
  html_url: "/"
}];

var user = {
  username: "",
  name: "",
  condition: "RESET",
  avatar: "",
  profile: "",
  followers: 0,
  followings: 0,
  num_repo: 0
};

global.pagination = {
  current: 0,
  total: 0,
  size: 10
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

  obj = [{
    name: "Enter your github username to animate your repos.",
    html_url: "/"
  }];

  var user = {
    name: "",
    condition: "RESET",
    avatar: "",
    profile: "",
    followers: 0,
    followings: 0,
    num_repo: 0
  };
  res.render("home", {

    repos: obj,
    account: user,
    pagi: pagination

  });

});

app.get("/validate/:username", (req, res) => {
  const username = req.params.username;
  const url = 'https://api.github.com' + '/users/' + username;
  var data;

  request({
    url: url,
    headers: {
      'user-agent': 'node.js'
    }
  }, function(error, response, data) {
    res.json(response);
  });
});

app.post("/", function(req, res) {

  request({
    url: "http://localhost:" + port + "/validate/" + req.body.username
  }, function(error, response, data) {
    if (JSON.parse(data).statusCode == 200) {
      const dataobj = JSON.parse(data);
      //console.log(JSON.parse(data));
      const obj = JSON.parse(dataobj.body);
      //console.log(obj);

      user.avatar = obj.avatar_url;
      user.profile = obj.html_url;
      user.name = obj.name;
      user.followers = obj.followers;
      user.followings = obj.following;
      user.num_repo = obj.public_repos;
      user.condition = "FOUND";
      user.username = obj.login;
      global.pagination = {
        current: 1,
        total: Math.ceil(user.num_repo / 10),
        size: 10
      };


      res.redirect("/results/1");

    } else {

      // HANDLE INVALID USERNAME
      console.log("Not a valid user");
      user.condition = "ERROR";
      obj = [{
        name: "Enter your github username to animate your repos.",
        html_url: "/"
      }];

      global.pagination = {
        current: 1,
        total: 0,
        size: 10
      };

      res.render("home", {

        account: user,
        repos: obj,
        pagi: global.pagination

      });

    }

  });

});

// PAGINATION PAGES

app.get("/results/:id", function(req, res) {

  global.pagination.current = req.params.id;

  url = 'https://api.github.com/users/' + user.username + '/repos?page=' + global.pagination.current + '&per_page=' + global.pagination.size;


  request({
    url: url,
    headers: {
      'user-agent': 'node.js'
    }
  }, function(error, response, data) {

    obj = JSON.parse(data);

    for (var i = 0; i < obj.length; i++) {

      obj[i].language = _.toLower(obj[i].language);

      if (obj[i].language == "html") obj[i].language = "html5";
      if (obj[i].language == "css") obj[i].language = "css3";
      if (obj[i].language == "c++") obj[i].language = "cplusplus";

      obj[i].created_at=obj[i].created_at.substring(0,10);
      obj[i].updated_at=obj[i].updated_at.substring(0,10);
    }

    res.render("home", {

      account: user,
      repos: obj,
      pagi: global.pagination

    });

  });

});



// RESET EVERYTHING
app.get("/reset", function(req, res) {

  obj = [{
    name: "Enter your github username to animate your repos.",
    html_url: "/"
  }];
  user = {
    name: "",
    condition: "RESET",
    avatar: "",
    profile: "",
    followers: 0,
    followings: 0,
    num_repo: 0
  };

  global.pagination = {
    current: 1,
    total: 0,
    size: 10
  };
  res.render("home", {

    repos: obj,
    account: user,
    pagi: global.pagination

  });
});
