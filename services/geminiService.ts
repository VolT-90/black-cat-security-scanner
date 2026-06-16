
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, ChatMessage } from "../types";

// Always use the named parameter for apiKey and obtain it from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an executive security report summary based on scan results.
 */
export async function generateSecurityReport(scanData: ScanResult) {
  // Use gemini-3-pro-preview for complex reasoning tasks like security analysis.
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze these security scan results for the website ${scanData.url} and generate a professional, concise executive summary. 
    Vulnerabilities found: ${JSON.stringify(scanData.vulnerabilities)}.
    Risk Score: ${scanData.riskScore}/100.`,
    config: {
      systemInstruction: "You are Black Cat AI, a senior cybersecurity expert. Provide actionable insights and a professional tone.",
    }
  });

  // Access .text property directly.
  return response.text;
}

/**
 * Gets a response from the security assistant chatbot.
 */
export async function getSecurityAssistantResponse(history: ChatMessage[]) {
  // Convert ChatMessage history to the format required by the GenAI SDK.
  const chatHistory = history.slice(0, -1).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: chatHistory,
    config: {
      systemInstruction: "You are the Black Cat Security Assistant. You help users understand web security concepts like XSS, SQL Injection, and how to use the Black Cat scanner. Keep answers technical yet accessible.",
    },
  });

  // Extract the latest user message.
  const lastMsg = history[history.length - 1].content;
  // Use chat.sendMessage with the required message parameter.
  const response = await chat.sendMessage({ message: lastMsg });
  
  // Access .text property directly.
  return response.text;
}
