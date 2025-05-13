"use client"

import axios from "axios";

import { useAuthStore } from "@/lib/zustand/authStore";
import { isTokenExpiredOrAboutToExpire } from "../utils/authUtils";
import { refreshAccessToken } from "./api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use(
  async (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    
    // Intercepta si el accessToken es null o está expirado/por expirar, y no estamos refrescando ya
    if (
      (!accessToken || isTokenExpiredOrAboutToExpire(accessToken)) &&
      !isRefreshing
    ) {
      isRefreshing = true;
      refreshPromise = refreshPromise ? refreshPromise : refreshAccessToken();
      const newAccessToken = await refreshPromise;
      
      refreshPromise = null;
      isRefreshing = false;

      if (newAccessToken) {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
        // Si la renovación falla con un mensaje de error
        useAuthStore.getState().logout();
        window.location.href = '/auth/login?error_message=auth_failed';
        return Promise.reject('Token de refresco falló, redirigiendo al login');
      }
    }

    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default api;
