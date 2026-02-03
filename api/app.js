const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = "3000";

app.listen(PORT, () => {
  console.log("API On!");
});
