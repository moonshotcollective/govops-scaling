const axios = require("axios");
require("dotenv").config();

const server = "https://gov.gitcoin.co/";
// "https://gov.gitcoin.co/posts/{id}.json";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const apiPort = 4001;
const { connection, collections } = require("./db");
const postRouter = require("./routes/post-router");
const stewardRouter = require("./routes/steward-router");
const proposalRouter = require("./routes/proposal-router");

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(bodyParser.json());

// Axios instance
const instance = axios.create({
  baseUrl: server,
  headers: {
    "Api-Key": process.env.API_KEY,
    "Api-Username": process.env.API_USERNAME,
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});


connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error: ")
);

app.use("/api", postRouter);
app.use("/api", stewardRouter);
app.use("/api", proposalRouter);

// Root api call for connectivity and info
app.get("/api", (req, res) => {
  res.send({ name: "GTC Govrnance API", version: "v1.0" });
  console.log("API is responding!");
});

// Get single post
app.get("/api/post/", async (req, res) => {
  try {
    console.log("Fetching post ", req.query.ID);
    const response = await instance.get(server + `posts/${req.query.ID}.json`);
    const result = {
      status: response.status + "-" + response.statusText,
      headers: response.headers,
      data: response.data,
    };
    console.log(result);

    res.send(result);
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
      const result = {
        status: response.status + "-" + response.statusText,
        headers: response.headers,
        data: response.data,
      };
      console.log(result);

      res.send(result);
    })
    .catch((error) => {
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
    });
});

app.listen(process.env.PORT || apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
  console.log("");
});
