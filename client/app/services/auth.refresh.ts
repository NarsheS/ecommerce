import axios from "axios";

const server = process.env.BACKEND_SERVER;

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${server}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    const token = response.data.access_token;

    if (!token) {
      throw new Error("access_token não retornado");
    }

    return token;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Refresh token inválido ou expirado", error);
      }
    }

    throw error;
  }
};