const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

//config DB

//config cookie parser

//config cors
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

//use json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config routes

//config listening
app.listen(port, () => console.log(`Listening on port: ${port}`));
