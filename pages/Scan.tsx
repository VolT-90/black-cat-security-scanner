import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Globe,
  Loader2,
  Lock,
  Menu,
  ScanSearch,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ScanSidebar } from "@/components/ScanSidebar";

import {
  createNormalScan,
  createScanStream,
  stopScan,
} from "@/services/newScanApi";

const URL_REGEX =
  /^(https?:\/\/)(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/.*)?$/;

const ACTIVE_SCAN_KEY = "black_cat_active_scan";

const unwrapResponse = (res: any) => res?.data ?? res;

type ActiveScanStorage = {
  scanId: string;
  url: string;
  progress: number;
  isScanning: boolean;
};

const saveActiveScan = (data: ActiveScanStorage) => {
  localStorage.setItem(ACTIVE_SCAN_KEY, JSON.stringify(data));
};

const getActiveScan = (): ActiveScanStorage | null => {
  try {
    const saved = localStorage.getItem(ACTIVE_SCAN_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const clearActiveScan = () => {
  localStorage.removeItem(ACTIVE_SCAN_KEY);
};

export const Scan: React.FC = () => {
  const navigate = useNavigate();
  const eventSourceRef = useRef<EventSource | null>(null);

  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);

  const [scanId, setScanId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [stopConfirmOpen, setStopConfirmOpen] = useState(false);
  const [isStoppingScan, setIsStoppingScan] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUrlChange = (value: string) => {
    setUrl(value);

    if (!value.trim()) {
      setIsValidUrl(null);
      return;
    }

    setIsValidUrl(URL_REGEX.test(value.trim()));
  };

  const closeStream = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  };

  const startStream = (id: string, targetUrl: string) => {
    closeStream();

    const eventSource = createScanStream(id);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("progress", (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      const percent = Number(data.progress ?? 0);
      const status = data.status;

      setProgress(percent);

      saveActiveScan({
        scanId: id,
        url: targetUrl,
        progress: percent,
        isScanning: true,
      });

      if (status === "failed") {
        closeStream();
        clearActiveScan();
        setIsScanning(false);
        return;
      }

      if (status === "stopped") {
        closeStream();
        clearActiveScan();
        setIsScanning(false);
        setProgress(0);
        setScanId(null);
        return;
      }

      if (status === "completed") {
        closeStream();
        clearActiveScan();

        setIsScanning(false);
        setProgress(0);
        setScanId(null);
        setUrl("");
        setIsValidUrl(null);

        navigate(`/scan/${id}/report`);
      }
    });

    eventSource.addEventListener("done", () => {
      closeStream();
    });

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      closeStream();

      const saved = getActiveScan();

      if (saved?.scanId === id && saved.isScanning) {
        setIsScanning(true);
      } else {
        setIsScanning(false);
      }
    };
  };

  useEffect(() => {
    const activeScan = getActiveScan();

    if (activeScan?.scanId && activeScan.isScanning) {
      setUrl(activeScan.url);
      setIsValidUrl(URL_REGEX.test(activeScan.url));
      setScanId(activeScan.scanId);
      setProgress(activeScan.progress ?? 0);
      setIsScanning(true);

      startStream(activeScan.scanId, activeScan.url);
    }

    return () => {
      closeStream();
    };
  }, []);

  const openConfirmModal = () => {
    if (!isValidUrl || isScanning) return;
    setConfirmOpen(true);
  };

  const startScan = async () => {
    if (!isValidUrl || isScanning) return;

    setConfirmOpen(false);

    try {
      setIsScanning(true);
      setProgress(0);
      setScanId(null);

      const targetUrl = url.trim();

      const response = await createNormalScan(targetUrl);
      const payload = unwrapResponse(response);

      const createdScanId = payload?._id || payload?.data?._id;

      if (!createdScanId) {
        throw new Error("Scan id not found");
      }

      setScanId(createdScanId);

      saveActiveScan({
        scanId: createdScanId,
        url: targetUrl,
        progress: 0,
        isScanning: true,
      });

      startStream(createdScanId, targetUrl);
    } catch (err) {
      console.error("Start scan error:", err);
      clearActiveScan();
      setIsScanning(false);
    }
  };

  const confirmStopScan = async () => {
    if (!scanId) return;

    try {
      setIsStoppingScan(true);

      await stopScan(scanId);

      closeStream();
      clearActiveScan();

      setIsScanning(false);
      setProgress(0);
      setScanId(null);
      setStopConfirmOpen(false);
    } catch (err) {
      console.error("Stop scan error:", err);
    } finally {
      setIsStoppingScan(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <ScanSidebar variant="desktop" />

      <main className="relative flex-1 lg:ml-72">
        <div className="lg:hidden w-full bg-navy-950/60 border-b border-navy-800">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 bg-navy-900 border border-navy-800 text-slate-200 px-4 py-2 rounded-xl font-black uppercase tracking-widest text-xs hover:border-neon-cyan/60 hover:text-neon-cyan transition"
            >
              <Menu size={18} />
              Scan Sidebar
            </button>

            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Full Scan
            </span>
          </div>
        </div>

        <div className="relative min-h-screen px-6 py-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.20),transparent_35%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <section className="relative z-10 w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-neon-cyan/30 bg-neon-cyan/10 shadow-[0_0_60px_rgba(0,255,255,0.25)]">
                <ScanSearch className="h-12 w-12 text-neon-cyan" />
              </div>

              <h1 className="text-6xl font-black tracking-tight">
                <span className="text-white">Full </span>
                <span className="bg-gradient-to-r from-neon-cyan to-cyan-300 bg-clip-text text-transparent">
                  Scan
                </span>
              </h1>

              <p className="mt-4 text-lg text-slate-400">
                Scan your target and detect web security vulnerabilities.
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
                    {isScanning ? (
                      <Loader2 className="h-5 w-5 animate-spin text-neon-cyan" />
                    ) : (
                      <Search className="h-5 w-5 text-neon-cyan" />
                    )}
                  </div>

                  <div>
                    <h2 className="font-bold">Website Security Scan</h2>
                    <p className="text-sm text-slate-400">
                      Enter your target and begin vulnerability scanning.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    openConfirmModal();
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                      <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                      <input
                        type="text"
                        value={url}
                        disabled={isScanning}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://target-domain.com"
                        className={`w-full rounded-2xl border bg-[#020617] py-4 pl-12 pr-4 text-white outline-none transition disabled:opacity-60 ${
                          isValidUrl === null
                            ? "border-white/10"
                            : isValidUrl
                              ? "border-neon-cyan"
                              : "border-red-500"
                        }`}
                      />
                    </div>

                    <motion.button
                      whileHover={
                        !isScanning && isValidUrl ? { scale: 1.03 } : undefined
                      }
                      whileTap={
                        !isScanning && isValidUrl ? { scale: 0.97 } : undefined
                      }
                      type="submit"
                      disabled={isScanning || !isValidUrl}
                      className={`rounded-2xl px-8 py-4 font-black transition ${
                        isScanning || !isValidUrl
                          ? "cursor-not-allowed bg-slate-700 text-slate-400"
                          : "bg-neon-cyan text-navy-900 shadow-[0_0_35px_rgba(0,255,255,0.35)] hover:bg-neon-cyan/90"
                      }`}
                    >
                      {isScanning ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Scanning
                        </span>
                      ) : (
                        "Scan Now"
                      )}
                    </motion.button>
                  </div>

                  {isValidUrl === false && (
                    <p className="text-left text-sm text-red-400 font-mono">
                      Invalid URL format. Use https://example.com
                    </p>
                  )}
                </form>

                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 14 }}
                      className="mt-5 rounded-3xl border border-neon-cyan/25 bg-neon-cyan/5 p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative mx-auto sm:mx-0 h-20 w-20 shrink-0 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-navy-800" />
                          <div className="absolute inset-0 rounded-full border-4 border-t-neon-cyan border-r-transparent border-b-transparent border-l-transparent animate-spin" />

                          <span className="text-lg font-black text-white font-mono">
                            {progress}%
                          </span>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-white font-black text-sm uppercase tracking-widest">
                            Scan Running
                          </h3>

                          <p className="text-slate-400 text-sm mt-1">
                            You can leave this page and come back. The scan
                            progress will continue.
                          </p>

                          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-navy-900 border border-navy-800">
                            <motion.div
                              className="h-full bg-neon-cyan shadow-[0_0_18px_rgba(94,234,212,0.6)]"
                              initial={false}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStopConfirmOpen(true)}
                          disabled={!scanId}
                          className="rounded-2xl bg-red-500/90 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          Stop
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isScanning && (
                  <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Lock className="h-4 w-4" />
                    Your target is only used for this security scan.
                  </div>
                )}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.15,
            }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 35,
                mass: 0.6,
              }}
              className="relative w-[85%] max-w-[320px] h-full"
            >
              <ScanSidebar
                variant="drawer"
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setConfirmOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-md rounded-[2rem] border border-neon-cyan/40 bg-navy-950/95 p-8 shadow-2xl shadow-neon-cyan/10"
            >
              <button
                onClick={() => setConfirmOpen(false)}
                className="absolute right-5 top-5 z-10 rounded-xl p-2 text-slate-500 hover:bg-navy-900 hover:text-white transition"
              >
                <X size={20} />
              </button>

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/10">
                <AlertTriangle size={34} />
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Confirm <span className="text-neon-cyan">New Scan</span>
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Are you sure you want to start a scan on this target?
                </p>

                <div className="bg-navy-900/80 border border-navy-800 rounded-2xl px-4 py-3 text-neon-cyan font-mono text-sm break-all">
                  {url.trim()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="rounded-2xl border border-navy-700 bg-navy-900 px-5 py-4 text-sm font-black uppercase tracking-widest text-slate-300 hover:border-slate-500 hover:text-white transition"
                >
                  Cancel
                </button>

                <button
                  onClick={startScan}
                  className="rounded-2xl bg-neon-cyan px-5 py-4 text-sm font-black uppercase tracking-widest text-navy-950 shadow-lg shadow-neon-cyan/20 hover:scale-[1.03] transition"
                >
                  Start Scan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stopConfirmOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                if (!isStoppingScan) setStopConfirmOpen(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-md rounded-[2rem] border border-red-500/40 bg-navy-950/95 p-8 shadow-2xl shadow-red-500/10"
            >
              <button
                onClick={() => setStopConfirmOpen(false)}
                disabled={isStoppingScan}
                className="absolute right-5 top-5 z-10 rounded-xl p-2 text-slate-500 hover:bg-navy-900 hover:text-white transition disabled:opacity-40"
              >
                <X size={20} />
              </button>

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10">
                {isStoppingScan ? (
                  <Loader2 size={34} className="animate-spin" />
                ) : (
                  <AlertTriangle size={34} />
                )}
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Cancel <span className="text-red-400">Scan?</span>
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Are you sure you want to cancel this scan?
                </p>

                <div className="bg-navy-900/80 border border-navy-800 rounded-2xl px-4 py-3 text-neon-cyan font-mono text-sm break-all">
                  {url.trim()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setStopConfirmOpen(false)}
                  disabled={isStoppingScan}
                  className="rounded-2xl border border-navy-700 bg-navy-900 px-5 py-4 text-sm font-black uppercase tracking-widest text-slate-300 hover:border-neon-cyan/50 hover:text-neon-cyan transition disabled:opacity-50"
                >
                  No, Continue
                </button>

                <button
                  onClick={confirmStopScan}
                  disabled={isStoppingScan}
                  className="rounded-2xl bg-red-500 px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:scale-[1.03] transition disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isStoppingScan ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Stopping...
                    </>
                  ) : (
                    "Yes, Cancel"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
