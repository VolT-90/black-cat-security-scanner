const API_BASE_URL = "https://mirao-malware-detection.hf.space";

export type MalwareApiResponse = {
  status: "Clean" | "Infected";
  filename: string;
  threat_type?: string;
  risk_level?: string;
  detection_source?: string;
  analysis: {
    summary: string;
    detected_indicators: string[];
    recommendation: string;
  };
};

export const scanMalewareFile = async (
  apkFile: File
): Promise<MalwareApiResponse> => {
  const formData = new FormData();
  formData.append("apk_file", apkFile);

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return JSON.parse(text);
};