import axios from "axios";

const API_BASE_URL = "https://black-cat.up.railway.app";

const getToken = () => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("userToken");

  if (!token || token === "null" || token === "undefined") {
    return "";
  }

  return token.replace(/^Bearer\s+/i, "").trim();
};

export const getScanResult = (scanId: string) => {
  const token = getToken();

  return axios.get(`${API_BASE_URL}/scan/${scanId}/result`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getScanVulnerabilities = (
  scanId: string,
  page = 1,
  limit = 10
) => {
  const token = getToken();

  return axios.get(`${API_BASE_URL}/scan/${scanId}/vulnerabilities`, {
    params: {
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};