const API_BASE_URL = "https://black-cat.up.railway.app";

const getToken = () => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("userToken");

  return token;
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const createNormalScan = async (target: string) => {
  const res = await fetch(`${API_BASE_URL}/scan/normal-scan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ target }),
  });

  return res.json();
};

export const createDeepScan = async (target: string) => {
  const res = await fetch(`${API_BASE_URL}/scan/deep-scan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ target }),
  });

  return res.json();
};

export const createScanStream = (scanId: string) => {
  return new EventSource(`${API_BASE_URL}/scan/${scanId}/stream`);
};


export const stopScan = async (scanId: string) => {
  const res = await fetch(
    `https://black-cat.up.railway.app/scan/${scanId}/stop`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  return res.json();
};