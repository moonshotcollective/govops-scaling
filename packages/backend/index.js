const axios = require("axios");
require("dotenv").config();

const server = "https://gov.gitcoin.co/";
// "https://gov.gitcoin.co/posts/{id}.json";

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

const instance = axios.create({
  baseUrl: server,
  headers: {
    "Api-Key": process.env.API_KEY,
    "Api-Username": process.env.API_USERNAME,
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});

app.get("/api", (req, res) => {
  res.send({ name: "GTC Govrnance API", version: "v1.0" });
  console.log("root path working");
});

// Get single post
app.get("/api/post/", async (req, res) => {
  try {
    console.log("Fetching post ", req.query.ID);
    const response = await instance.get(server + `posts/${req.query.ID}.json`);
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

// Get latest posts
app.get("/api/posts/", async (req, res) => {
  try {
    const response = await instance.get(server + `posts/`);
    const result = {
      status: response.status + "-" + response.statusText,
      headers: response.headers,
      data: response.data,
    };
    console.log(result.data.latest_posts);

    return res.send(result);
  } catch (error) {
    if (error.response) {
      // get response with a status code not in range 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // no response
      console.log(error.request);
    } else {
      // Something wrong in setting up the request
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
});

// Fetch all relplies for a single Post
app.get("/api/post/replies/", (req, res) => {
  instance
    .get(server + `posts/${req.query.ID}.json`)
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
