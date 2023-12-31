const express = require("express");
const log = require("morgan")("dev");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin/entity");
const appRoutes = require("./routes/app/entity");

const db = require("./mongodb/database");

const app = express();

const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

db();
dotenv.config();
app.use(cors());
app.use(log);
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/app", appRoutes);
// app.use("/entity", entityRoutes);

app.listen(process.env.PORT, () =>
  console.log(`"Example app listening on port ${process.env.PORT}!"`)
);
