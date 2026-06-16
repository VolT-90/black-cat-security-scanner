import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileWarning,
  Loader2,
  XCircle,
  Smartphone,
  Lock,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

import { scanMalewareFile } from "../services/malewareService";

type MalwareResult = {
  status: "clean" | "malware";
  message: string;
  recommendation: string;
  fileName: string;
  threatType?: string;
  riskLevel?: string;
  detectionSource?: string;
  indicators?: string[];
};

export default function Malware() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MalwareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const scrollToResult = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    setResult(null);
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleScan = useCallback(async () => {
    if (!file || loading) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = await scanMalewareFile(file);

      const isMalware = data.status.toLowerCase() === "infected";

      const scanResult: MalwareResult = {
        status: isMalware ? "malware" : "clean",
        message:
          data.analysis?.summary ||
          (isMalware
            ? "Suspicious behavior detected inside the uploaded file."
            : "No malicious behavior detected. This APK appears to be benign."),
        recommendation:
          data.analysis?.recommendation ||
          "Always download apps from trusted sources.",
        fileName: data.filename || file.name,
        threatType: data.threat_type,
        riskLevel: data.risk_level,
        detectionSource: data.detection_source,
        indicators: data.analysis?.detected_indicators || [],
      };

      setResult(scanResult);
      scrollToResult();
    } catch (err) {
      console.log("Malware scan error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to scan this file. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [file, loading]);

  const danger = result?.status === "malware";

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <main className="relative overflow-y-auto">
        <div className="relative px-6 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.20),transparent_35%)] pointer-events-none" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

          <section className="relative z-10 mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-neon-cyan/30 bg-neon-cyan/10 shadow-[0_0_60px_rgba(0,255,255,0.25)]">
                <Smartphone className="h-12 w-12 text-neon-cyan" />
              </div>

              <h1 className="text-6xl font-black tracking-tight">
                <span className="text-white">Malware </span>
                <span className="bg-gradient-to-r from-neon-cyan to-cyan-300 bg-clip-text text-transparent">
                  Detection
                </span>
              </h1>

              <p className="mt-4 text-lg text-slate-400">
                Upload your APK file and scan it for suspicious behavior.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-xl"
            >
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1224]/90 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neon-cyan/10">
                    <UploadCloud className="h-5 w-5 text-neon-cyan" />
                  </div>

                  <div>
                    <h2 className="font-bold">APK Malware Analysis</h2>
                    <p className="text-sm text-slate-400">
                      Choose APK file and start malware detection.
                    </p>
                  </div>
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col gap-4 md:flex-row">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="flex min-h-[70px] flex-1 items-center gap-4 rounded-2xl border border-white/10 bg-[#020617]/80 px-5 text-left transition hover:border-neon-cyan/50 hover:bg-neon-cyan/5"
                  >
                    <UploadCloud className="h-6 w-6 shrink-0 text-slate-500" />

                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-200">
                        {file ? file.name : "Choose APK file"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {file
                          ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                          : "Upload suspicious APK file"}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleScan}
                    disabled={!file || loading}
                    className="min-h-[70px] rounded-2xl bg-gradient-to-r from-neon-cyan to-cyan-400 px-8 font-black text-[#020617] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 md:min-w-[180px]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Scanning
                      </span>
                    ) : (
                      "Scan Now"
                    )}
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Lock size={16} />
                  Your APK file is only used for this security check.
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="mt-5 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
                    >
                      <XCircle size={20} />
                      <p className="text-sm font-bold">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {file && (
                  <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-neon-cyan/20 bg-neon-cyan/5 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-cyan/10 text-neon-cyan">
                        <FileWarning size={22} />
                      </div>

                      <div>
                        <p className="font-bold text-white">{file.name}</p>
                        <p className="text-sm text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={removeFile}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
                    >
                      Remove File
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {result && (
                    <motion.div
                      ref={resultRef}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      className={`mt-6 rounded-2xl border p-5 ${
                        danger
                          ? "border-red-500/30 bg-red-500/10"
                          : "border-emerald-500/30 bg-emerald-500/10"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                            danger
                              ? "bg-red-500/15 text-red-300"
                              : "bg-emerald-500/15 text-emerald-300"
                          }`}
                        >
                          {danger ? (
                            <AlertTriangle size={24} />
                          ) : (
                            <CheckCircle size={24} />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-black text-white">
                            {danger ? "Threat Detected" : "File Looks Clean"}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {result.message}
                          </p>

                          {danger && (
                            <div className="mt-4 space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {result.threatType && (
                                  <span className="rounded-lg bg-red-500/15 px-3 py-1 text-xs font-bold text-red-300">
                                    Threat: {result.threatType}
                                  </span>
                                )}

                                {result.riskLevel && (
                                  <span className="rounded-lg bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-300">
                                    Risk: {result.riskLevel}
                                  </span>
                                )}
                              </div>

                              {result.detectionSource && (
                                <p className="text-sm text-slate-400">
                                  Detection Source: {result.detectionSource}
                                </p>
                              )}
                            </div>
                          )}

                          {result.indicators &&
                            result.indicators.length > 0 && (
                              <div className="mt-4 rounded-2xl border border-white/10 bg-[#020617]/50 p-4">
                                <h4 className="mb-3 font-bold text-red-300">
                                  Detected Indicators
                                </h4>

                                <ul className="space-y-2 text-sm text-slate-300">
                                  {result.indicators.map((indicator, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                                      <span>{indicator}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          <div className="mt-4 rounded-2xl border border-white/10 bg-[#020617]/50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-neon-cyan">
                              <Lightbulb size={18} />
                              <h4 className="font-bold">Recommendation</h4>
                            </div>

                            <p className="text-sm leading-6 text-slate-300">
                              {result.recommendation}
                            </p>
                          </div>

                          <p className="mt-3 text-xs text-slate-500">
                            File: {result.fileName}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
