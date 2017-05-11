"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const crypto = require("crypto");
const database = require("./database/database.js");


const app = express();
const PORT = process.env.PORT || 8080;

const urlDatabase = database.urlDatabase;
const users =database.users;

console.log(database.users)

// need to refactor code to access database)

function startServer() {

  let templateVars = {
    urls: database.urlDatabase,
    username:  undefined,
    curShortURL: ""
  }

  app.set("view engine", "ejs");

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser())


  app.get("/", (req, res) => {
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
    let longURL = templateVars.urls[req.params.shortURL]
    res.redirect(longURL);
  });

  app.get("/urls/:id", (req, res) => {
    templateVars.curShortURL = req.params.id;
    res.render("urls_show", templateVars);
  });

  app.post( "/urls/:id", (req, res) => {
    templateVars.urls[req.params.id] = req.body.updateURL;
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
                  "password" : req.body.password,
                  "urlsDB": {}
    };
    res.cookie( "userID", id);
    console.log(users)
    res.redirect("/urls");
  });


  app.get( "/login", (req, res) => {
    res.render( "login", templateVars);
  });

  app.post( "/login", (req, res) => {
    let userPW = req.body.password;
    let userEmail = req.body.email;
    if ( !userPW || !userEmail) {
      res.send("Please enter an email and password.")
    };
    for ( let user in users) {
      if ( users[user].email === userEmail) {
        templateVars.username = users[user].name;
        templateVars.urls = users[user].urlsDB;
        if ( !req.cookies.userID) {
          res.cookie("userID" , users[user].id );
        }
        res.redirect("/");
      };
    };
    res.send("email and Password do not match. Please try again.");
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