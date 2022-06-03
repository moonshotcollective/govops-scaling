import axios from "axios";

const server = "https://tdao-api.herokuapp.com/";
// "https://{defaultHost}/posts/{id}.json";

const requestConfig = {
  headers: { "Api-Key": "", "Api-Username": "" },
};

// Fetch a single Post
export const getSinglePost = async id => {
  const params = new URLSearchParams([["id", id]]);
  try {
    const res = await axios.get(server, requestConfig, { params });
    // console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

// Fetch all relplies for a single Post
export const getRepliesToPost = async id => {
  const params = new URLSearchParams([["id", id]]);
  try {
    const res = await axios.get(server, requestConfig, { params });
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
