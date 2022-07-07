import axios from "axios";

const server = "http://localhost:4001";

export async function getSingleProposalData(params) {
  try {
    const res = await axios.get(`${server}/api/proposals`, { params });
    if (res.data.success) {
      return res.data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function getAllPropsalData() {
  try {
    const res = await axios.get(`${server}/api/proposals`, {});
    if (res.data.success) {
      return res.data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}
