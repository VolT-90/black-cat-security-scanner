import axios from "axios";

const API_URL = "https://black-cat.up.railway.app";

const getToken = () => {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

const authHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error("No access token found");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createChatSession = async () => {
  const response = await axios.post(
    `${API_URL}/chat/sessions`,
    {},
    {
      headers: authHeaders(),
    },
  );

  return response.data;
};

export const getAllChatSessions = async () => {
  const response = await axios.get(`${API_URL}/chat/sessions`, {
    headers: authHeaders(),
  });

  return response.data;
};

export const getSessionMessages = async (sessionId: string) => {
  const response = await axios.get(
    `${API_URL}/chat/sessions/${sessionId}/messages`,
    {
      headers: authHeaders(),
    },
  );

  return response.data;
};

export const sendChatMessage = async (sessionId: string, message: string) => {
  const response = await axios.post(
    `${API_URL}/chat/sessions/${sessionId}/messages`,
    { message },
    {
      headers: authHeaders(),
    },
  );

  return response.data;
};

export const deleteChatSession = async (sessionId: string) => {
  const response = await axios.delete(`${API_URL}/chat/sessions/${sessionId}`, {
    headers: authHeaders(),
  });

  return response.data;
};