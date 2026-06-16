export interface ScanResult {
  url: string;
  timestamp: string;
  vulnerabilities: Vulnerability[];
  riskScore: number;
  scanTime: string;
}

export interface Vulnerability {
  type: string;
  severity: "High" | "Medium" | "Low" | "Informational";
  description: string;
  evidence: string;
  remediation: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface SpiderResponse {
  status: string;
  scan_id: string;
  urls_count: number;
  urls: string[];
}

export interface ActiveScanResponse {
  scan_id: number;
  message: string;
}

export interface AscanStatusResponse {
  scan_id: number;
  scan_type: string;
  status: string;
  started_at: string;
  started_date: string;
  completed_at: any;
  elapsed_seconds: number;
  elapsed_minutes: number;
  progress_percent: number;
  estimated_remaining_seconds: number;
  estimated_remaining_minutes: number;
  baseUrl: string;
}

export interface AscanResultResponse {
  status: string;
  scan_id: number;
  baseUrl: string;
  alerts_count: number;
  summary_total: number;
  summary: Summary;
  alerts: Alert[];
}

export interface Summary {
  High: number;
  Low: number;
  Medium: number;
  Informational: number;
}

export interface Alert {
  sourceid: string;
  other: string;
  method: string;
  evidence: string;
  pluginId: string;
  cweid: string;
  confidence: string;
  sourceMessageId: number;
  wascid: string;
  description: string;
  messageId: string;
  inputVector: string;
  url: string;
  reference: string;
  solution: string;
  alert: string;
  param: string;
  attack: string;
  name: string;
  risk: string;
  id: string;
  alertRef: string;
}

export interface AJAXResponse {
  status: string;
  urls_count: number;
  urls: Url[];
}

export interface Url {
  note: string;
  rtt: string;
  responseBody: string;
  cookieParams: string;
  requestBody: string;
  responseHeader: string;
  requestHeader: string;
  id: string;
  type: string;
  timestamp: string;
  tags: string[];
}


export type ScanStatus = "safe" | "suspicious" | "malware";

export interface MalwareResult {
  status: ScanStatus;
  message: string;
}

export interface ScanResponse {
  status: ScanStatus;
  message: string;
}