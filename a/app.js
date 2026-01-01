const express = require("express");
const session = require("express-session");

const app = express();
app.use(session({ secret: "secret" }));

app.get("/test", (req, res) => {
  res.send("test successfull");
});

app.get("/reqCount", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`Requested tiger ${req.session.count} time`);
});

app.listen(8000, () => console.log("App is listening on the port 8000"));
