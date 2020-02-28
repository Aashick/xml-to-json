const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const async = require("async");
const xmlToJson = require("xml-to-json-stream");
const parser = xmlToJson({ attributeMode: false });
const js2xmlparser = require("js2xmlparser");
//var urlJSON = 'https://api.github.com/users/hadley/repos'
var urlXML = "http://www.w3schools.com/xml/plant_catalog.xml";
const port = 8080;

app.get("/gogo", (req, res) => {
  res.send("Aashick");
});

app.get("/json-data", (req, res) => {
  // let htmData;
  axios
    .get(urlXML)
    .then(response => {
      //fetched XML-data
      let xmlData = response.data;
      let jsonData;
      let jsonforXML;
      fs.writeFile("xmlData", xmlData, err => {
        if (err) return console.log(err);
        res.send(xmlData);
      });
      async.series(
        [
          //XML to JSON
          function(callback) {
            parser.xmlToJson(xmlData, (err, json) => {
              jsonforXML = json;
              jsonData = JSON.stringify(json);
              fs.writeFile("jsonData", jsonData, errr => {
                if (errr) {
                  return console.log("errr", errr);
                }
                callback(console.log("XML-TO-JSON!!!!"));
              });
            });
          },
          //JSON to XML
          function(callback) {
            let convertedXML = js2xmlparser.parse("new", jsonforXML);
            fs.writeFile("converted-XML-Data", convertedXML, err => {
              if (err) {
                return console.log("err", err);
              }
              callback(console.log("JSON-TO-XML-js2xmlparser!!!!"));
            });
          }
        ],
        function(err, result) {
          console.log("Final Response!!!");
        }
      );
    })
    .catch(error => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log("listening on 8080!");
});
