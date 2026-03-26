import axios from "axios";

const API = axios.create({
  baseURL: "https://tender-from.onrender.com",
});

export default API;
