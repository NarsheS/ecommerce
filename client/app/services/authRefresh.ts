import axios from "axios";

export const refreshAccessToken = async (): Promise<string> => {
  const response = await axios.post(
    "https://ecommerce-cyrl.onrender.com/api/auth/refresh",
    {},
    { withCredentials: true }
  );

  const token = response.data.access_token; // ✅ CORRETO

  if (!token) {
    throw new Error("access_token não retornado");
  }

  return token;
};