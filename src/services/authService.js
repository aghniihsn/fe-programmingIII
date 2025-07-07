import axios from "axios";

const API_URL = "https://be-programmingiii-production.up.railway.app/login";
const REGISTER_URL = "https://be-programmingiii-production.up.railway.app/register";

export const login = async (username, password) => {
  const response = await axios.post(API_URL, { username, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(REGISTER_URL, userData);
  return response.data;
};