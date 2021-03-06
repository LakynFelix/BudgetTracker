const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const apiRoutes = require("./routes/api");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
//  mongoose connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
 
});

// routes
app.use(require("./routes/api.js"));

// app listening 
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
