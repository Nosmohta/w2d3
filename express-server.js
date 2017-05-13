"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const session = require('cookie-session')
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
    curShortURL: "",
    errorMSG: ""
  };

  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(session( {
      name: 'session',
      keys: ["sdfafbdajf"],
      maxAge: 24 * 60 * 60 * 1000
    }
  ));


  app.get("/", (req, res) => {
    if (isLogIn(req)) {
      res.redirect("/urls");
    } else {
      res.redirect("/login");
    }
  });

  app.get("/urls", (req, res) => {
    if( isLogIn(req)) {
      res.render("urls_index", templateVars);
    } else {
      addErMsg( templateVars, "You must Login to view this page.");
      res.redirect("/login");
    }
  });

  app.post("/urls/", (req, res) => {
    if (isLogIn(req)) {
      let shortURL = generateRandomString();
      let id = req.session.userID;
      users[id].urlsDB[shortURL] = req.body.longURL;
      res.redirect("/urls")
    } else {
      addErMsg( templateVars, "You must Login to view this page.");
      res.redirect("/login");
    }
  });

  app.get("/urls/new", (req, res) => {
     if( isLogIn(req)) {
      res.render("urls_new", templateVars);
    } else {
      addErMsg( templateVars, "You must Login to view this page.");
      res.redirect("/login");
    }
  });

  app.post("/urls/:id/delete", (req, res) => {
    if ( isLogIn(req)) {
      if (users[req.session.userID].urlsDB.hasOwnProperty(req.params.id) ) {
        let userID = req.session.userID
        delete users[userID].urlsDB[req.params.id];
        res.redirect("/urls");
      } else {
        res.send("You do not have access to this property.")
      }
    } else {
      addErMsg( templateVars, "You must Login to view this page.");
      res.redirect("/login");
    }
  });

  app.get("/u/:shortURL", (req, res) => {
    let shortURL = req.params.shortURL
    let longURL = ""
    for (let userId in users) {
      if (users[userId].urlsDB.hasOwnProperty(shortURL)) {
        longURL = users[userId].urlsDB[shortURL];
        res.redirect("http://" + longURL)
      }
    }
    res.send("No URL is associated with that path.");
  });

  app.get("/urls/:id", (req, res) => {
    if( isLogIn(req)) {
      let user = req.session.userID
      if ( users[user].urlsDB.hasOwnProperty(req.params.id)) {
        templateVars.curShortURL = req.params.id;
        res.render("urls_show", templateVars);
      } else {
        res.send("Short url not valid.")
      }
    } else {
      addErMsg( templateVars, "You must Login to view this page.");
      res.redirect("/login");
    }
  });

  app.post( "/urls/:id", (req, res) => {
    if( isLogIn(req)) {
      if (users[req.session.userID].urlsDB.hasOwnProperty(req.params.id) ) {
        templateVars.urls[req.params.id] = req.body.updateURL;
        res.redirect("/urls");
      } else {
        res.send("You do not own that short URL property.");
      }
    } else {
      addErMsg( templateVars, "You must Login to view this page.");
      res.redirect("/login");
    }
  });

  app.get( "/register", (req, res) => {
    if (isLogIn(req)) {
      res.redirect("/urls");
    } else {
      res.render( "register", templateVars);
    }
  });

  app.post( "/register",  (req, res) => {
    if ( req.body.email == "") {
      res.status(400).send( "Please provide valid email.");
      return;
    }
    for (let user in users) {
      if(req.body.email === users[user].email ) {
        res.status(400).send( "Email is already in our database.");
        return;
      }
    }
    let id = generateRandomString(users);
    let PW = bcrypt.hashSync(req.body.password, 10);
    users[id] = { "id" : id,
                  "name": req.body.name,
                  "email" : req.body.email,
                  "password" : PW,
                  "urlsDB" : {}
                }
    templateVars.username = users[id].name;
    templateVars.urls = users[id].urlsDB;
    removeErMsg(templateVars);
    req.session.userID = id ;
    res.redirect("/urls");
  });


  app.get( "/login", (req, res) => {
    if (isLogIn(req)) {
      res.redirect("/urls");
    } else {
      res.render( "login", templateVars);
    }
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
          removeErMsg(templateVars);
          req.session.userID = users[user].id;
          res.redirect("/urls");
        }
      }
    };
    res.send("Email and Password do not match. Please try again.");
  });

  app.post( "/logout", (req, res) => {
    templateVars.username = undefined;
    removeErMsg(templateVars);
    req.session = null;
    res.redirect("/urls");
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
}

function isLogIn(requestObj) {
  let userID = requestObj.session.userID;
  if ( users.hasOwnProperty( userID)) {
    return true;
  } else {
    return false;
  }
}

function addErMsg(templateVars, string) {
  templateVars.errorMSG = string;
  return;
}

function removeErMsg(templateVars){
  templateVars.errorMSG = "";
  return;
}

function generateRandomString(checkObj) {
  let randStr = crypto.randomBytes(3).toString('hex');
  if (checkObj && checkObj.hasOwnProperty(randStr)){
    return generateRandomString(checkObj);
  };
  return randStr;
}


startServer();

