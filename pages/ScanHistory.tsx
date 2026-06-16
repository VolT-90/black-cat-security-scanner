import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
  Globe,
  Plus,
  ShieldCheck,
  Loader2,
  Trash2,
} from "lucide-react";
import { ScanSidebar } from "../components/ScanSidebar";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getAllScans, deleteScan } from "@/services/ScanHistoryApi";

const PAGE_LIMIT = 5;

type ScanSummary = {
  high: number;
  medium: number;
  low: number;
  informational: number;
};

type ScanItem = {
  _id: string;
  target: string;
  scanType: "normal" | "deep";
  status: string;
  progress: number;
  createdAt: string;
  durationText?: string;
  failureReason?: string | null;
  result?: {
    summary?: ScanSummary;
    summaryTotal?: number;
    alertsCount?: number;
    baseUrl?: string;
  };
};

const getStatusStyle = (status: string) => {
  if (status === "completed") {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  }

  if (status === "failed") {
    return "bg-red-500/10 text-red-300 border-red-500/30";
  }

  if (status === "scanning") {
    return "bg-blue-500/10 text-blue-300 border-blue-500/30";
  }

  if (status === "stopped") {
    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
  }

  return "bg-slate-500/10 text-slate-300 border-slate-500/30";
};

const getScanDot = (type: string) => {
  return type === "deep" ? "bg-purple-400" : "bg-neon-cyan";
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatScanType = (type: string) => {
  return type === "deep" ? "Deep Scan" : "Normal Scan";
};

const getHostName = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

export const ScanHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 1,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["scan-history", pagination.page, PAGE_LIMIT],
    queryFn: () => getAllScans(pagination.page, PAGE_LIMIT),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteScan,

    onSuccess: (data) => {
      toast.success(data?.message || "Scan deleted successfully", {
        icon: "🗑️",
        style: {
          background:
            "linear-gradient(135deg, rgba(25,8,8,0.98), rgba(45,10,10,0.96))",
          color: "#ffe2e2",
          border: "1px solid rgba(239,68,68,0.35)",
          borderRadius: "20px",
          padding: "16px 18px",
          fontWeight: "800",
          fontSize: "14px",
          letterSpacing: "0.3px",
          backdropFilter: "blur(18px)",
          boxShadow: `
            0 0 15px rgba(239,68,68,0.22),
            0 0 40px rgba(239,68,68,0.10),
            inset 0 0 12px rgba(255,255,255,0.03)
          `,
        },
        iconTheme: {
          primary: "#ef4444",
          secondary: "#140707",
        },
      });

      queryClient.invalidateQueries({
        queryKey: ["scan-history"],
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete scan";

      toast.error(message, {
        icon: "⚠️",
        style: {
          background:
            "linear-gradient(135deg, rgba(25,8,8,0.98), rgba(45,10,10,0.96))",
          color: "#fecaca",
          border: "1px solid rgba(248,113,113,0.35)",
          borderRadius: "20px",
          padding: "16px 18px",
          fontWeight: "800",
          fontSize: "14px",
          letterSpacing: "0.3px",
          backdropFilter: "blur(18px)",
          boxShadow: `
            0 0 15px rgba(248,113,113,0.22),
            0 0 40px rgba(248,113,113,0.10),
            inset 0 0 12px rgba(255,255,255,0.03)
          `,
        },
      });
    },
  });

  const handleDeleteScan = (scanId: string) => {
    deleteMutation.mutate(scanId);
  };

  const scans: ScanItem[] = data?.data || [];

  const totalPages =
    data?.pagination?.pages || data?.pagination?.totalPages || 1;

  useEffect(() => {
    if (pagination.page < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["scan-history", pagination.page + 1, PAGE_LIMIT],
        queryFn: () => getAllScans(pagination.page + 1, PAGE_LIMIT),
        staleTime: 1000 * 60 * 5,
      });
    }
  }, [pagination.page, totalPages, queryClient]);

  const filteredScans = useMemo(() => {
    return scans.filter(
      (scan) =>
        scan.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.scanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [scans, searchTerm]);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-red-400 font-bold">
        Failed to load scans.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#020617] text-white">
      <div className="hidden lg:block">
        <ScanSidebar variant="desktop" />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: -360 }}
              animate={{ x: 0 }}
              exit={{ x: -360 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              className="fixed left-0 top-0 z-50 h-screen w-[320px] lg:hidden"
            >
              <ScanSidebar
                variant="drawer"
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative flex-1 lg:ml-72 min-w-0 overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.20),transparent_35%)] pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="relative z-10 lg:hidden w-full bg-navy-950/60 border-b border-navy-800">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 bg-navy-900 border border-navy-800 text-slate-200 px-4 py-2 rounded-xl font-black uppercase tracking-widest text-xs hover:border-neon-cyan/60 hover:text-neon-cyan transition"
            >
              <Menu size={18} />
              Scan Sidebar
            </button>

            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Scan History
            </span>
          </div>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-12 overflow-x-hidden">
          <div className="w-full max-w-[1450px] mx-auto space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  My{" "}
                  <span className="bg-gradient-to-r from-neon-cyan to-cyan-300 bg-clip-text text-transparent">
                    Scans
                  </span>
                </h1>

                <p className="text-slate-400 text-sm mt-2">
                  All security scans you have executed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search scans..."
                    className="w-full sm:w-72 bg-navy-950 border border-navy-800 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <Link
                  to="/scan"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neon-cyan px-5 py-3 text-sm font-black text-navy-950 hover:opacity-90 transition whitespace-nowrap"
                >
                  <Plus size={16} />
                  New Scan
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] overflow-hidden shadow-2xl backdrop-blur-xl">
              {isLoading || isFetching ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-neon-cyan" size={38} />
                  <p className="text-slate-400 font-bold">Loading scans...</p>
                </div>
              ) : (
                <>
                  <div className="hidden xl:block">
                    <div className="grid grid-cols-[2.05fr_0.75fr_0.75fr_0.85fr_1.45fr_0.35fr_0.9fr] border-b border-navy-800 bg-navy-950/70">
                      {[
                        "Target",
                        "Scan Type",
                        "Status",
                        "Created At",
                        "Summary",
                        "Total",
                        "Action",
                      ].map((head) => (
                        <div
                          key={head}
                          className="px-5 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400"
                        >
                          {head}
                        </div>
                      ))}
                    </div>

                    {filteredScans.length > 0 ? (
                      filteredScans.map((scan) => {
                        const summary = scan.result?.summary;
                        const canViewReport =
                          scan.status === "completed" &&
                          !deleteMutation.isPending;

                        return (
                          <div
                            key={scan._id}
                            className="grid grid-cols-[2.05fr_0.75fr_0.75fr_0.85fr_1.45fr_0.35fr_0.9fr] items-center border-b border-navy-800/70 hover:bg-navy-800/30 transition"
                          >
                            <div className="px-5 py-5 min-w-0">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="shrink-0 h-11 w-11 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-center text-neon-cyan">
                                  <Globe size={20} />
                                </div>

                                <div className="min-w-0">
                                  <div
                                    className="text-white font-bold text-sm truncate"
                                    title={scan.target}
                                  >
                                    {scan.target}
                                  </div>
                                  <div className="text-slate-500 text-xs mt-1 truncate">
                                    {getHostName(scan.target)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="px-5 py-5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`shrink-0 h-2.5 w-2.5 rounded-full ${getScanDot(
                                    scan.scanType,
                                  )}`}
                                />
                                <span className="text-slate-300 text-sm font-semibold leading-5">
                                  {formatScanType(scan.scanType)}
                                </span>
                              </div>
                            </div>

                            <div className="px-5 py-5">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black whitespace-nowrap ${getStatusStyle(
                                  scan.status,
                                )}`}
                              >
                                {formatStatus(scan.status)}
                              </span>
                            </div>

                            <div className="px-5 py-5">
                              <div className="text-slate-300 text-sm font-semibold">
                                {new Date(scan.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-slate-500 text-xs mt-1">
                                {new Date(scan.createdAt).toLocaleTimeString()}
                              </div>
                            </div>

                            <div className="px-5 py-5">
                              {scan.status === "failed" ? (
                                <span className="text-slate-500">-</span>
                              ) : (
                                <div className="flex items-center gap-2 flex-nowrap">
                                  <span className="rounded-lg bg-red-500/15 border border-red-500/30 px-2 py-1 text-xs font-black text-red-300">
                                    {summary?.high || 0}
                                  </span>

                                  <span className="rounded-lg bg-orange-500/15 border border-orange-500/30 px-2 py-1 text-xs font-black text-orange-300">
                                    {summary?.medium || 0}
                                  </span>

                                  <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 text-xs font-black text-emerald-300">
                                    {summary?.low || 0}
                                  </span>

                                  <span className="rounded-lg bg-neon-cyan/15 border border-neon-cyan/30 px-2 py-1 text-xs font-black text-neon-cyan">
                                    {summary?.informational || 0}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="px-5 py-5">
                              <span className="text-white font-black">
                                {scan.result?.summaryTotal || 0}
                              </span>
                            </div>

                            <div className="px-5 py-5">
                              <div className="flex items-center gap-2">
                                {canViewReport ? (
                                  <Link
                                    to={`/scan/${scan._id}/report`}
                                    className="inline-flex h-10 w-[104px] items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 text-xs font-black text-neon-cyan hover:bg-neon-cyan hover:text-navy-950 transition whitespace-nowrap"
                                  >
                                    View Report
                                  </Link>
                                ) : (
                                  <button
                                    disabled
                                    title={
                                      scan.status === "failed"
                                        ? "Report is not available because scan failed"
                                        : "Report is not ready yet"
                                    }
                                    className="inline-flex h-10 w-[104px] cursor-not-allowed items-center justify-center rounded-xl border border-slate-700 bg-slate-800/40 text-xs font-black text-slate-500 opacity-60 whitespace-nowrap"
                                  >
                                    View Report
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteScan(scan._id)}
                                  disabled={deleteMutation.isPending}
                                  title="Delete scan"
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deleteMutation.isPending &&
                                  deleteMutation.variables === scan._id ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-6 py-20 text-center">
                        <ShieldCheck
                          size={44}
                          className="mx-auto mb-4 text-neon-cyan"
                        />
                        <p className="text-slate-400 font-bold">
                          No scans found.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="xl:hidden p-4 space-y-4">
                    {filteredScans.length > 0 ? (
                      filteredScans.map((scan) => {
                        const summary = scan.result?.summary;
                        const canViewReport = scan.status === "completed";

                        return (
                          <div
                            key={scan._id}
                            className="rounded-2xl border border-white/10 bg-navy-950/70 p-4 space-y-4 backdrop-blur-xl"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="shrink-0 h-11 w-11 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-center text-neon-cyan">
                                <Globe size={20} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="text-white font-bold text-sm break-words">
                                  {scan.target}
                                </div>
                                <div className="text-slate-500 text-xs mt-1">
                                  {getHostName(scan.target)}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-slate-500 text-xs font-black uppercase">
                                  Scan Type
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-slate-300 font-semibold">
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${getScanDot(
                                      scan.scanType,
                                    )}`}
                                  />
                                  {formatScanType(scan.scanType)}
                                </div>
                              </div>

                              <div>
                                <p className="text-slate-500 text-xs font-black uppercase">
                                  Status
                                </p>
                                <span
                                  className={`mt-1 inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getStatusStyle(
                                    scan.status,
                                  )}`}
                                >
                                  {formatStatus(scan.status)}
                                </span>
                              </div>

                              <div>
                                <p className="text-slate-500 text-xs font-black uppercase">
                                  Created
                                </p>
                                <p className="mt-1 text-slate-300 font-semibold">
                                  {new Date(
                                    scan.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              <div>
                                <p className="text-slate-500 text-xs font-black uppercase">
                                  Total
                                </p>
                                <p className="mt-1 text-white font-black">
                                  {scan.result?.summaryTotal || 0}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="rounded-lg bg-red-500/15 border border-red-500/30 px-2.5 py-1 text-xs font-black text-red-300">
                                H {summary?.high || 0}
                              </span>

                              <span className="rounded-lg bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 text-xs font-black text-orange-300">
                                M {summary?.medium || 0}
                              </span>

                              <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-black text-emerald-300">
                                L {summary?.low || 0}
                              </span>

                              <span className="rounded-lg bg-neon-cyan/15 border border-neon-cyan/30 px-2.5 py-1 text-xs font-black text-neon-cyan">
                                I {summary?.informational || 0}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              {canViewReport ? (
                                <Link
                                  to={`/scan/${scan._id}/report`}
                                  className="inline-flex flex-1 h-11 items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 text-xs font-black text-neon-cyan hover:bg-neon-cyan hover:text-navy-950 transition"
                                >
                                  View Report
                                </Link>
                              ) : (
                                <button
                                  disabled
                                  className="inline-flex flex-1 h-11 cursor-not-allowed items-center justify-center rounded-xl border border-slate-700 bg-slate-800/40 text-xs font-black text-slate-500 opacity-60"
                                >
                                  View
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteScan(scan._id)}
                                disabled={deleteMutation.isPending}
                                title="Delete scan"
                                className="inline-flex h-11 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-6 py-20 text-center">
                        <ShieldCheck
                          size={44}
                          className="mx-auto mb-4 text-neon-cyan"
                        />
                        <p className="text-slate-400 font-bold">
                          No scans found.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-navy-800 bg-navy-950/50">
                    <div className="flex items-center gap-5 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        High
                      </span>

                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-400" />
                        Medium
                      </span>

                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Low
                      </span>

                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-neon-cyan" />
                        Info
                      </span>
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => changePage(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="h-9 w-9 rounded-xl border border-navy-800 bg-navy-900 text-slate-300 disabled:opacity-40 hover:border-neon-cyan hover:text-neon-cyan transition flex items-center justify-center"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => changePage(index + 1)}
                            className={`h-9 w-9 rounded-xl text-xs font-black transition ${
                              pagination.page === index + 1
                                ? "bg-neon-cyan text-navy-950"
                                : "border border-navy-800 bg-navy-900 text-slate-300 hover:border-neon-cyan hover:text-neon-cyan"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => changePage(pagination.page + 1)}
                          disabled={pagination.page === totalPages}
                          className="h-9 w-9 rounded-xl border border-navy-800 bg-navy-900 text-slate-300 disabled:opacity-40 hover:border-neon-cyan hover:text-neon-cyan transition flex items-center justify-center"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
