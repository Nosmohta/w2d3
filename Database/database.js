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
      },
      "urlsDBLogs":{
        "aaaaaa" : {
          "dateMade": "Sat May 13 2017 15:14:50 GMT+0000 (UTC)",
          "visits": [],
          "uVisits": []
        },
        "bbbbbb" : {
          "dateMade": "Sat May 13 2017 15:14:50 GMT+0000 (UTC)",
          "visits": [],
          "uVisits": []
        },
        "cccccc" : {
          "dateMade": "Sat May 13 2017 15:14:50 GMT+0000 (UTC)",
          "visits": [],
          "uVisits": []
        }
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
          "dateMade": "Sat May 13 2017 15:14:50 GMT+0000 (UTC)",
          "visits": [],
          "uVisits": []
        },
        "eeeeee" : {
          "dateMade": "Sat May 13 2017 15:14:50 GMT+0000 (UTC)",
          "visits": [],
          "uVisits": []
        },
        "ffffff" : {
          "dateMade": "Sat May 13 2017 15:14:50 GMT+0000 (UTC)",
          "visits": [],
          "uVisits": []
        }
      }
    }
  }
}

module.exports = database = database;