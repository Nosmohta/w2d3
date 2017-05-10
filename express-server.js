"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");


const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "dfgoin": "http://www.amazon.ca",
  "sdfjkb": "http://www.wikipedia.com"
};

function startServer() {
  app.set("view engine", "ejs");

  app.use(bodyParser.urlencoded({extended: true}));


  app.get("/", (req, res) => {
    res.end("Hello!");
  });

  app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  })

  app.post("/urls/", (req, res) => {
    let shortURL = generateRandomString(urlDatabase);
    urlDatabase[shortURL] = req.body.longURL;
    //res.statusCode = 302
    res.redirect("/urls/"+shortURL)
  });

  app.post("/urls/:id/delete", (req, res) => {
      console.log("I recieved a post req to delete")
      console.log(req.params.id);
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
  })

  app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
  });

  app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL: req.params.id,
                         urls: urlDatabase
                        };
    res.render("urls_show", templateVars);
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