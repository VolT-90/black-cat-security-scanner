import axios from "axios";

const API_URL = "https://black-cat.up.railway.app";

const getToken = () => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error("No access token found in localStorage");
  }

  return token;
};


export const getAllScans = async (page: number, limit: number) => {
  const token = getToken();

  const response = await axios.get(`${API_URL}/scan`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const deleteScan = async (scanId: string) => {
  const token = getToken();

  const response = await axios.delete(`${API_URL}/scan/${scanId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};