import axios from "axios";

const API_URL = "https://black-cat.up.railway.app";

const getToken = () => {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

const authHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

export type ReportRiskType = "All" | "High" | "Medium" | "Low";

export const generateReport = async (
  scanId: string,
  typeOfRisk: ReportRiskType
) => {
  return axios.post(`${API_URL}/reports/${scanId}/generate`, null, {
    params: {
      typeOfRisk,
    },
    headers: authHeaders(),
  });
};

export const getReportStatus = async (reportId: string) => {
  return axios.get(`${API_URL}/reports/${reportId}/status`, {
    headers: authHeaders(),
  });
};

export const getReportsByScan = async (scanId: string) => {
  return axios.get(`${API_URL}/reports/scan/${scanId}`, {
    headers: authHeaders(),
  });
};

export const deleteReport = async (reportId: string) => {
  return axios.delete(`${API_URL}/reports/${reportId}`, {
    headers: authHeaders(),
  });
};