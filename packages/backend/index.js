const axios = require("axios");
require("dotenv").config();

const server = "https://gov.gitcoin.co/";
// "https://gov.gitcoin.co/posts/{id}.json";

const requestConfig = {
  headers: {
    "Api-Key": process.env.API_KEY,
    "Api-Username": process.env.API_USERNAME,
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
};

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const apiPort = 4001;

// var https = require('https');

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send({ name: "GTC Govrnance API", version: "v1.0" });
  console.log("root path working");
});

// Get single post
app.get("/api/post/", (req, res) => {
  console.log("Fetching post ", req.query.ID);
  axios
    .get(server + `posts/${req.query.ID}.json`, requestConfig)
    .then((response) => {
      console.log("returning post ", req.query.ID);
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
});

// Get latest posts
app.get("/api/posts/", async (req, res) => {
  const response = await axios.get(server + `posts/`, requestConfig);
  console.log(response.data.latest_posts);
  return response;
});

// Fetch all relplies for a single Post
app.get("/api/post/replies/", (req, res) => {
  axios
    .get(server + `posts/${req.query.ID}.json`, requestConfig)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(process.env.PORT || apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
  console.log("");
});

// https.createServer({}, app).listen(8443, console.log("App running on 8443"));
