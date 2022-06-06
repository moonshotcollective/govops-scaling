const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// const { connection, collections } = require("./db");

const app = express();
const apiPort = 4001;

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send({ name: "Discourse Middleware", version: "v1.0" });
});

app.listen(process.env.PORT || apiPort, () => {
    console.log(`Server running on port ${apiPort}`);
    console.log("");
});