const express = require("express");
const log = require("morgan")("dev");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const userRoutes = require("./routes/user");
const entityRoutes = require("./routes/entity");

const db = require("./mongodb/database");

const app = express();

const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

db();
dotenv.config();
app.use(log);
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

app.use("/", userRoutes);
app.use("/entity", entityRoutes);

app.listen(process.env.PORT, () =>
  console.log(`"Example app listening on port ${process.env.PORT}!"`)
);
