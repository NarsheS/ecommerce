import axios from "axios"
import { refreshAccessToken } from "./auth.refresh"

export const api = axios.create({
  baseURL: "https://ecommerce-cyrl.onrender.com/api",
  withCredentials: true, // envia cookies httpOnly
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

let isRefreshing = false
let queue: any[] = []

const resolveQueue = (error: any, token: string | null = null) => {
  queue.forEach(p => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  queue = []
}

// interceptor para lidar automaticamente com refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const token = await refreshAccessToken()

        setAuthToken(token) // atualiza header default do axios

        resolveQueue(null, token)

        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (err) {
        resolveQueue(err, null)
        window.location.href = "/login"
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
