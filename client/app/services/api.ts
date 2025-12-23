import axios from "axios"

export const api = axios.create({
  baseURL: "https://ecommerce-cyrl.onrender.com/api",
  withCredentials: true,
});
