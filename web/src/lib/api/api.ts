"use client";

import { useAuthStore } from "../zustand/authStore";
import axios from "axios";
import api from "./apiClient";
import { handleClientApiError } from "../utils/error-handler-client";

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload): Promise<string> {
  try {
    const res = await axios.post(`/api/auth/login`, payload, {
      withCredentials: true,
    });

    useAuthStore.getState().setAccessToken(res.data.access_token);
    return res.data.access_token;
  } catch (error: unknown) {
    const clientError = handleClientApiError(error, "Error al iniciar sesión.");
    throw clientError;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post<{ access_token: string }>(
      `/api/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );

    const newAccessToken = res.data.access_token;

    useAuthStore.getState().setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error: unknown) {
    return null;
  }
}

export async function getUserProfile() {
  try {
    const res = await api.get("/auth/profile");
    
    return res.data;
  } catch (error) {
    const clientError = handleClientApiError(
      error,
      "Error al obtener el perfil de usuario."
    );
    throw clientError;
  }
}
