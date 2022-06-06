import axios from "axios";

const server = "https://localhost:4001/api/";

const requestConfig = {
  headers: {
    "Api-Key": "d51045979bec5317b4c3b628320a47d0186e6156d0d9aac1313c1dfadb12a60e",
    "Api-Username": "All Users",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
};

// Fetch a single Post
export const getSinglePost = async id => {
  const params = new URLSearchParams([["id", id]]);
  try {
    const res = await axios.get(server, requestConfig, { params });
    console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

// Fetch all relplies for a single Post
export const getRepliesToPost = async id => {
  const params = new URLSearchParams([["id", id]]);
  try {
    const res = await axios.get(server + ".json", requestConfig, { params });
    // console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

// still have to figure the tags out...
export const getTagsForPost = async id => {
  const params = new URLSearchParams([["id", id]]);
  try {
    const res = await axios.get(server, requestConfig, { params });
    // console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

// Any logic we need to perform on the returned data...
