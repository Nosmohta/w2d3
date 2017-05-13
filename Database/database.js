const bcrypt = require("bcrypt");

let database = {
  "users": {
    "randomID1" : {
      "id" : "randomID1",
      "email": "andrew@thomson.earth",
      "name": "Andrew",
      "password": bcrypt.hashSync("password", 10),
      "urlsDB": {
        "aaaaaa" : "www.google.ca",
        "bbbbbb" : "www.thomson.com",
        "cccccc" : "www.bike.com"
      }
    },
    "randomID2": {
      "id" : "randomID2",
      "email" : "Sam@sample.email",
      "name": "SAM",
      "password": bcrypt.hashSync("password", 10),
      "urlsDB": {
                      "dddddd" : "www.google.com",
                      "eeeeee" : "www.cbc.ca",
                      "ffffff" : "www.wikipedia.com"
                      },
      "urlsDBLogs":{
        "dddddd" : {
          "dateMade": "",
          "visits": [],
          "uVisits": []
        },
        "eeeeee" : {
          "dateMade": "",
          "visits": [],
          "uVisits": []
        },
        "ffffff" : {
          "dateMade": "",
          "visits": [],
          "uVisits": []
        }
      }
    }
  }

}

module.exports = database = database;