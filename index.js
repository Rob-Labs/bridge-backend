require("dotenv").config();
const express = require("express");
const APP_PORT = process.env.APP_PORT;
const app = express();
const routes = require("./routes/route");

app.use(express.json());

app.use("/api", routes);

app.listen(APP_PORT, () => {
  console.log(`Server Started at ${APP_PORT}`);
});
