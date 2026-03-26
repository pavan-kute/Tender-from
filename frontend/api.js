import axios from "axios";

const API = axios.create({
  baseURL: "https://tender-from.onrender.com/api",
});

export default API;
