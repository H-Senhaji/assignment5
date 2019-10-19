const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

//counter middleware
let counter = 0;
let allowed = true;
let myCounter = function(req, res, next) {
  ++counter;
  console.log("counter", counter);
  if (counter > 5) {
    allowed = false;
    res.statusCode = 429;
    res.json({ message: "429 Too Many Requests" });
  }
  next();
};
//app.use
app.use(myCounter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET
app.get("/get", function(req, res) {
  res.send("Hello Get!");
});

//POST
app.post("/post", (req, res, next) => {
  if (allowed && (!req.body.text || req.body.text.length === 0)) {
    res.statusCode = 400;
    res.json({ message: "400 Bad Request" });
  }
  if (allowed && req.body.text) {
    res.json({
      message: "Message received loud and clear!"
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));