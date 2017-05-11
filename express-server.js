"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "dfgoin": "http://www.amazon.ca",
  "sdfjkb": "http://www.wikipedia.com"
};


function startServer() {

  let templateVars = {
    urls: urlDatabase,
    username:  undefined ,
    curShortURL: ""
  }

  app.set("view engine", "ejs");

  app.use(bodyParser.urlencoded({extended: true}));


  app.get("/", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.get("/urls", (req, res) => {
    res.render("urls_index", templateVars);
  });

  app.post("/urls", (req, res) => {
    let shortURL = generateRandomString(urlDatabase);
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect("/urls/"+shortURL)
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new", templateVars);
  })

  app.post("/urls/:id/delete", (req, res) => {
      console.log("I recieved a post req to delete")
      console.log(req.params.id);
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
  });

  app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
  });

  app.get("/urls/:id", (req, res) => {
    templateVars.curShortURL = req.params.id;
    res.render("urls_show", templateVars);
  });

  app.post( "/urls/:id", (req, res) => {
    urlDatabase[req.params.id] = req.body.updateURL;
    res.redirect("/urls/");
  });


  app.get( "/login", (req, res) => {
    res.send( "You have tried to login");
  });

  app.post( "/login", (req, res) => {
    //needs to check for preexisting usernames
    console.log(req.body.username);
    res.cookie( "username", req.body.username);
    templateVars.username = req.body.username;
    console.log( templateVars.username)
    res.redirect("/urls");
  });



  // app.get(("/login/:username"), (req, res) => {
  //   console.log("This person has logged in:" + req.params.username);
  //   res.render("urls_index", templateVars);
  // });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

}


function generateRandomString(checkObj) {
  let randStr = crypto.randomBytes(3).toString('hex');
  if (checkObj.hasOwnProperty(randStr)){
    return generateRandomString(checkObj);
  };
  return randStr;
}


//console.log(generateRandomString(urlDatabase))
startServer();