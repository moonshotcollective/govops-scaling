import axios from "axios";

const server = "http://localhost:4001/api/";

const requestConfig = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
};

// Fetch a single Post
export const getSinglePost = async id => {
  // const params = new URLSearchParams([["ID", id]]);
  console.log("Fetching single post");
  await axios
    .get(server + "post/", { params: { ID: id } })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
};

// Fetch all relplies for a single Post
export const getRepliesToPost = async ({ id }) => {
  const params = new URLSearchParams([["id", id]]);
  try {
    const res = await axios.get(server + ".json", requestConfig, { params });
    console.log(res);
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
