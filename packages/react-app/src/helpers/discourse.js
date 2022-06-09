import axios from "axios";

const server = "http://localhost:4001/api/";

// Fetch a single Post
export const getSinglePost = async id => {
  console.log("Fetching single post");
  try {
    const response = await axios.get(server + "post/", { params: { ID: id } });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestPosts = async () => {
  console.log("Fetching latest posts");
  try {
    const response = await axios.get(server + "posts/");
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Fetch all relplies for a single Post
export const getRepliesToPost = async ({ id }) => {
  try {
    const res = await axios.get(server + "post/replies/", { params: { ID: id } });
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

// still have to figure the tags out...
export const getTagsForPost = async id => {
  try {
    const res = await axios.get(server, { params: { ID: id } });
    // console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

// Any logic we need to perform on the returned data...
