// src/services/authApi.ts

import axios from "axios";

const API_BASE_URL = "https://black-cat.up.railway.app";

// Signin api
export const loginApi = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  return response.data;
};

// Refresh token api
export const refreshTokenApi = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await axios.post(
    `${API_BASE_URL}/user/refresh-token`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  return response.data;
};

// Signup api
export const signupApi = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      confirmPassword,
    }),
  });

  const data = await response.json();

  console.log("FULL RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
};