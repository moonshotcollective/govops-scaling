const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios").default;

const server = "https://cors-anywhere.herokuapp.com/https://gov.gitcoin.co/";
// "https://gov.gitcoin.co/posts/{id}.json";

const requestConfig = {
  headers: {
    "Api-Key":
    process.env.API_KEY,
    "Api-Username": "jaxcoder",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
};

const app = express();
const apiPort = 4001;

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send({ name: "GTC Govrnance API", version: "v1.0" });
  console.log("root path working");
});

app.get("/api/posts/", async (req, res) => {
  console.log(req);
  const params = new URLSearchParams([["id", id]]);
  try {
    const res = await axios.get(`${server}t/`, requestConfig, { params });
    console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
  console.log("Returning Post: ");
});

app.listen(process.env.PORT || apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
  console.log("");
});
