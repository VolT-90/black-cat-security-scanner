import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const runSpider = (target: string) =>
  API.post("/explore/spider", { target });

export const runAjax = (target: string) =>
  API.post("/explore/ajax", { target });

export const runActiveScan = (target: string) =>
  API.post("/explore/active", { target });

export const stopScan = (scanId: number) =>
  API.post(`/ascan/${scanId}/stop`);

export const getScanStatus = (scanId: number) =>
  API.get(`/ascan/${scanId}/status`);

export const getScanResults = (scanId: number) =>
  API.get(`/ascan/${scanId}/results`);
