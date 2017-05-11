"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const database = require("./database/database.js");

const app = express();
const PORT = process.env.PORT || 8080;

const urlDatabase = database.urlDatabase;
const users =database.users;

console.log(database.users)


function startServer() {

  let templateVars = {
    urls: urlDatabase,
    username:  undefined ,
    curShortURL: "",
    msg: ""
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

  app.get( "/register", (req, res) => {
    res.render( "register", templateVars);
  });



  app.post( "/register",  (req, res) => {
    if ( req.body.email == "") {
      res.status(400).send( "Please provide valid email.");
      return;
    }
    for (let user in users) {
      if(req.body.email == users[user].email ) {
        res.status(400).send( "Email is already in our database.");
        return;
      };
    };
    let id = generateRandomString(users);
    users[id] = { "id" : id,
                  "email" : req.body.email,
                  "password" : req.body.password,//Make hash
                  "urlsDB": {}
    };
    res.cookie( "userID", id);
    console.log(users)
    res.redirect("/urls");

  });


  app.get( "/login", (req, res) => {
    res.send( "You have tried to login");
  });

  app.post( "/login", (req, res) => {
    res.cookie( "username", req.body.username);
    templateVars.username = req.body.username;
    res.redirect("/urls");
  });

  app.post( "/logout", (req, res) => {
    templateVars.username = undefined;
    res.redirect("/urls");
  });

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