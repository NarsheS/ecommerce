import axios from "axios";

export const refreshAccessToken = async () => {
    const response = await axios.post(
        "https://ecommerce-cyrl.onrender.com/api/auth/refresh",
        {},
        { withCredentials: true }
    );

    return response.data.accessToken
}