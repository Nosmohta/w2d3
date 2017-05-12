"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const database = require("./database/database.js");


const urlDatabase = database.urlDatabase;
const users =database.users;


function startServer() {

  const app = express();
  const PORT = process.env.PORT || 8080;

  let templateVars = {
    urls: urlDatabase,
    username:  undefined,
    curShortURL: ""
  };

  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());


  app.get("/", (req, res) => {
    res.render("welcome", templateVars);
  });

  app.get("/urls", (req, res) => {
    res.render("urls_index", templateVars);
  });

  app.post("/urls/new", (req, res) => {
    let shortURL = generateRandomString();
    let id = req.cookies.userID;
    users[id].urlsDB[shortURL] = req.body.longURL;
    res.redirect("/urls")
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new", templateVars);
  });

  app.post("/urls/:id/delete", (req, res) => {
    if (req.cookies.userID) {
      let userID = req.cookies.userID
      console.log("about to delete:", users[userID].urlsDB[req.params.id])
      delete users[userID].urlsDB[req.params.id];
      console.log( users[userID].urlsDB);
      res.redirect("/urls");
    }
    res.send("No userID found. Please login and enable cookies.")
  });

  app.get("/u/:shortURL", (req, res) => {
    let shortURL = req.params.shortURL
    console.log(req.params.shortURL)
    let longURL = ""
    for (let userId in users) {
      console.log(users[userId].urlsDB)
      if (users[userId].urlsDB.hasOwnProperty(shortURL)) {
        longURL = users[userId].urlsDB[shortURL];
      }
    }
    res.redirect("http://" + longURL);
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
    let PW = bcrypt.hashSync(req.body.password, 10);
    users[id] = { "id" : id,
                  "name": req.body.name,
                  "email" : req.body.email,
                  "password" : PW,
                  "urlsDB": { "x1x1x1": "www.YourFirstShortURL.com"}
    };
    console.log(users[id]);
    res.cookie( "userID", id);
    console.log(users[id])
    res.redirect("/login");
  });


  app.get( "/login", (req, res) => {
    res.render( "login", templateVars);
  });

  app.post( "/login", (req, res) => {
    let providedPW = req.body.password;
    let userEmail = req.body.email;
    if ( !providedPW || !userEmail) {
      res.send("Please enter an email and password.")
    };
    for ( let user in users) {
      if ( users[user].email === userEmail) {
        if ( bcrypt.compareSync( providedPW, users[user].password) ) {
          templateVars.username = users[user].name;
          templateVars.urls = users[user].urlsDB;
          res.cookie("userID" , users[user].id );
          res.redirect("/urls");
        }
      }
    };
    res.send("Email and Password do not match. Please try again.");
  });

  app.post( "/logout", (req, res) => {
    templateVars.username = undefined;
    res.redirect("/");
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
}



function generateRandomString(checkObj) {
  let randStr = crypto.randomBytes(3).toString('hex');
  if (checkObj && checkObj.hasOwnProperty(randStr)){
    return generateRandomString(checkObj);
  };
  return randStr;
}


//console.log(generateRandomString(urlDatabase))
startServer();