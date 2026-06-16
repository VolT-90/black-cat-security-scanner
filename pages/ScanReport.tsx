import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Bot,
  ChevronLeft,
  ChevronRight,
  Download,
  Globe,
  Info,
  Loader2,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Activity,
  PieChart,
  FileText,
  ExternalLink,
} from "lucide-react";

import {
  getScanResult,
  getScanVulnerabilities,
} from "@/services/ScanReportApi";

import {
  generateReport,
  getReportStatus,
  ReportRiskType,
} from "@/services/ReportApi";

type Risk = "High" | "Medium" | "Low" | "Informational";
type RiskFilter = "All" | Risk;

type Vulnerability = {
  _id: string;
  scanId: string;
  url: string;
  alert: string;
  param: string;
  attack: string;
  risk: Risk;
  createdAt: string;
  updatedAt?: string;
};

type ScanDetails = {
  _id: string;
  target: string;
  scanType: string;
  status: string;
  startedAt: string;
  finishedAt: string;
  durationText?: string;
  failureReason: string | null;
  result: {
    summary: {
      high: number;
      medium: number;
      low: number;
      informational: number;
    };
    baseUrl: string;
    alertsCount: number;
    summaryTotal: number;
  };
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

const riskStyle = (risk: Risk) => {
  if (risk === "High") return "bg-red-500/10 text-red-300 border-red-500/30";
  if (risk === "Medium")
    return "bg-orange-500/10 text-orange-300 border-orange-500/30";
  if (risk === "Low")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const pages: Array<number | "..."> = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (currentPage > 3) pages.push("...");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (currentPage < totalPages - 2) pages.push("...");
  pages.push(totalPages);

  return pages;
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";
  return parsedDate.toLocaleString();
};

const getDurationText = (startedAt?: string, finishedAt?: string) => {
  if (!startedAt || !finishedAt) return "-";

  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return "-";

  const totalSeconds = Math.floor((end - start) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

const showCyberSuccessToast = (title: string, message?: string) => {
  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto w-[92vw] max-w-md overflow-hidden rounded-2xl border border-neon-cyan/40 bg-navy-950/95 shadow-2xl shadow-neon-cyan/20 backdrop-blur-xl transition-all duration-300 ${
          t.visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <div className="relative p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/15 via-transparent to-emerald-400/10" />
          <div className="relative z-10 flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan shadow-lg shadow-neon-cyan/20">
              <ShieldCheck size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-white">{title}</p>
              {message && (
                <p className="mt-1 break-words text-xs font-bold leading-5 text-slate-300">
                  {message}
                </p>
              )}
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-lg px-2 py-1 text-lg font-black leading-none text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="relative z-10 mt-4 h-1 overflow-hidden rounded-full bg-navy-800">
            <div className="h-full w-full animate-pulse rounded-full bg-neon-cyan" />
          </div>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "top-center",
    },
  );
};

const showCyberErrorToast = (title: string, message?: string) => {
  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto w-[92vw] max-w-md overflow-hidden rounded-2xl border border-red-500/40 bg-navy-950/95 shadow-2xl shadow-red-500/20 backdrop-blur-xl transition-all duration-300 ${
          t.visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <div className="relative p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/15 via-transparent to-orange-500/10" />
          <div className="relative z-10 flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/15 text-red-300 shadow-lg shadow-red-500/20">
              <ShieldAlert size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-white">{title}</p>
              {message && (
                <p className="mt-1 break-words text-xs font-bold leading-5 text-red-200/90">
                  {message}
                </p>
              )}
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-lg px-2 py-1 text-lg font-black leading-none text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="relative z-10 mt-4 h-1 overflow-hidden rounded-full bg-navy-800">
            <div className="h-full w-full animate-pulse rounded-full bg-red-400" />
          </div>
        </div>
      </div>
    ),
    {
      duration: 6000,
      position: "top-center",
    },
  );
};

const SummaryCard = ({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: "total" | "alerts" | "high" | "medium" | "low" | "info";
}) => {
  const styles = {
    total: {
      box: "border-neon-cyan/30 bg-neon-cyan/10",
      text: "text-neon-cyan",
      icon: <Info size={28} />,
    },
    alerts: {
      box: "border-purple-500/30 bg-purple-500/10",
      text: "text-purple-300",
      icon: <ShieldAlert size={28} />,
    },
    high: {
      box: "border-red-500/30 bg-red-500/10",
      text: "text-red-300",
      icon: <ShieldAlert size={28} />,
    },
    medium: {
      box: "border-orange-500/30 bg-orange-500/10",
      text: "text-orange-300",
      icon: <ShieldAlert size={28} />,
    },
    low: {
      box: "border-emerald-500/30 bg-emerald-500/10",
      text: "text-emerald-300",
      icon: <ShieldCheck size={28} />,
    },
    info: {
      box: "border-cyan-500/30 bg-cyan-500/10",
      text: "text-cyan-300",
      icon: <Info size={28} />,
    },
  };

  return (
    <div
      className={`rounded-2xl border p-5 flex items-center justify-between ${styles[type].box}`}
    >
      <div>
        <h3 className={`text-3xl font-black ${styles[type].text}`}>{value}</h3>
        <p className={`mt-1 text-sm font-bold ${styles[type].text}`}>{title}</p>
      </div>

      <div className={styles[type].text}>{styles[type].icon}</div>
    </div>
  );
};

const AlertRatioSection = ({
  summary,
}: {
  summary: {
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
}) => {
  const total =
    summary.high + summary.medium + summary.low + summary.informational;

  const getPercent = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const highPercent = getPercent(summary.high);
  const mediumPercent = getPercent(summary.medium);
  const lowPercent = getPercent(summary.low);
  const infoPercent = getPercent(summary.informational);

  const ratioItems = [
    {
      label: "High Alerts",
      short: "High",
      value: summary.high,
      percent: highPercent,
      color: "bg-red-400",
      text: "text-red-300",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      icon: <ShieldAlert size={22} />,
    },
    {
      label: "Medium Alerts",
      short: "Medium",
      value: summary.medium,
      percent: mediumPercent,
      color: "bg-orange-400",
      text: "text-orange-300",
      border: "border-orange-500/30",
      bg: "bg-orange-500/10",
      icon: <Activity size={22} />,
    },
    {
      label: "Low Alerts",
      short: "Low",
      value: summary.low,
      percent: lowPercent,
      color: "bg-emerald-400",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      icon: <ShieldCheck size={22} />,
    },
    {
      label: "Informational Alerts",
      short: "Info",
      value: summary.informational,
      percent: infoPercent,
      color: "bg-cyan-400",
      text: "text-cyan-300",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      icon: <Info size={22} />,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-[2rem] border border-navy-800 bg-navy-900/80 p-6 lg:p-8"
    >
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-neon-cyan/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 text-neon-cyan">
              <PieChart size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Alert Ratio
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-white">
              Vulnerability Risk Distribution
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-bold text-slate-400">
              Visual overview of all detected alerts grouped by severity level.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-8 items-center">
          <div className="flex justify-center">
            <div className="relative h-[310px] w-[310px] rounded-full border border-navy-700 bg-navy-950/70 flex items-center justify-center shadow-2xl shadow-neon-cyan/10">
              <motion.div
                initial={{ rotate: -120, scale: 0.85, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-5 rounded-full"
                style={{
                  background: `conic-gradient(
                    rgb(248 113 113) 0deg ${highPercent * 3.6}deg,
                    rgb(251 146 60) ${highPercent * 3.6}deg ${
                      (highPercent + mediumPercent) * 3.6
                    }deg,
                    rgb(52 211 153) ${(highPercent + mediumPercent) * 3.6}deg ${
                      (highPercent + mediumPercent + lowPercent) * 3.6
                    }deg,
                    rgb(34 211 238) ${
                      (highPercent + mediumPercent + lowPercent) * 3.6
                    }deg 360deg
                  )`,
                }}
              />

              <div className="absolute inset-[74px] rounded-full border border-navy-700 bg-navy-900 flex flex-col items-center justify-center text-center">
                <p className="text-5xl font-black text-white">{total}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-400">
                  Total Alerts
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {ratioItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className={`rounded-3xl border ${item.border} ${item.bg} p-5`}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-2xl ${item.bg} ${item.text} border ${item.border} flex items-center justify-center`}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="text-white font-black">{item.label}</h3>
                      <p className="text-xs font-bold text-slate-400">
                        {item.percent}% of scan alerts
                      </p>
                    </div>
                  </div>

                  <p className={`text-3xl font-black ${item.text}`}>
                    {item.value}
                  </p>
                </div>

                <div className="h-4 rounded-full bg-navy-950/80 overflow-hidden border border-navy-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.9, delay: 0.25 + index * 0.12 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Ratio
                  </span>

                  <span className={`text-sm font-black ${item.text}`}>
                    {item.percent}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export const ScanReport: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [scan, setScan] = useState<ScanDetails | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [vulnerabilitiesLoading, setVulnerabilitiesLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [vulnerabilitiesError, setVulnerabilitiesError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("All");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const [selectedReportType, setSelectedReportType] =
    useState<ReportRiskType>("All");

  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchScanResult = async () => {
    if (!scanId) {
      setErrorMessage("Scan ID missing");
      setPageLoading(false);
      return;
    }

    try {
      setPageLoading(true);
      const response = await getScanResult(scanId);
      setScan(response.data.data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to load scan report",
      );
    } finally {
      setPageLoading(false);
    }
  };

  const fetchVulnerabilities = async () => {
    if (!scanId) return;

    try {
      setVulnerabilitiesLoading(true);
      const response = await getScanVulnerabilities(scanId, page, rowsPerPage);

      setVulnerabilities(response.data.data || []);

      setPagination(
        response.data.pagination || {
          page: 1,
          limit: rowsPerPage,
          total: 0,
          pages: 1,
        },
      );
    } catch (error: any) {
      setVulnerabilitiesError(
        error?.response?.data?.message || "Failed to load vulnerabilities",
      );
    } finally {
      setVulnerabilitiesLoading(false);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleGenerateReport = async () => {
    if (!scanId || generatingReport) return;

    try {
      setGeneratingReport(true);

      const response = await generateReport(scanId, selectedReportType);

      showCyberSuccessToast(
        "Report generation started",
        response?.data?.message || "AI is preparing your PDF report now.",
      );

      const reportId = response?.data?.data?._id;

      if (!reportId) {
        throw new Error("Report ID not found");
      }

      stopPolling();

      pollingRef.current = setInterval(async () => {
        try {
          const statusResponse = await getReportStatus(reportId);
          const report = statusResponse?.data?.data;
          const status = report?.status;

          if (status === "COMPLETED") {
            stopPolling();
            setGeneratingReport(false);

            showCyberSuccessToast(
              "Report generated successfully",
              "Your PDF is ready. Redirecting you to all reports.",
            );

            navigate(`/scan/${scanId}/reports`);
          }

          if (status === "FAILED") {
            stopPolling();
            setGeneratingReport(false);

            showCyberErrorToast(
              "Report generation failed",
              report?.failureReason ||
                statusResponse?.data?.err_message ||
                statusResponse?.data?.message ||
                "Something went wrong while generating the report.",
            );
          }
        } catch (error: any) {
          stopPolling();
          setGeneratingReport(false);

          showCyberErrorToast(
            "Failed to fetch report status",
            error?.response?.data?.err_message ||
              error?.response?.data?.message ||
              "Could not check the report status. Please try again.",
          );
        }
      }, 3000);
    } catch (error: any) {
      stopPolling();
      setGeneratingReport(false);

      showCyberErrorToast(
        "Failed to generate report",
        error?.response?.data?.err_message ||
          error?.response?.data?.message ||
          error?.message ||
          "Could not start report generation. Please try again.",
      );
    }
  };

  useEffect(() => {
    fetchScanResult();
  }, [scanId]);

  useEffect(() => {
    fetchVulnerabilities();
  }, [scanId, page, rowsPerPage]);

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter((vuln) => {
      const search = searchTerm.toLowerCase();

      const matchSearch =
        vuln.alert.toLowerCase().includes(search) ||
        vuln.url.toLowerCase().includes(search) ||
        vuln.param.toLowerCase().includes(search);

      const matchRisk = riskFilter === "All" || vuln.risk === riskFilter;

      return matchSearch && matchRisk;
    });
  }, [vulnerabilities, searchTerm, riskFilter]);

  const totalPages = Math.max(1, pagination.pages);

  const visiblePages = useMemo(() => {
    return getVisiblePages(page, totalPages);
  }, [page, totalPages]);

  const startResult = pagination.total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endResult = Math.min(page * rowsPerPage, pagination.total);

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-neon-cyan" />
          <p className="text-slate-400 font-bold">Loading scan report...</p>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 max-w-md text-center">
          <p className="text-red-300 text-xl font-black">
            Scan report not found
          </p>

          <p className="mt-3 text-slate-400 text-sm">{errorMessage}</p>

          <Link
            to="/scan/history"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-5 py-3 text-navy-950 font-black"
          >
            <ArrowLeft size={18} />
            Back To My Scans
          </Link>
        </div>
      </div>
    );
  }

  const summary = scan.result.summary;

  return (
    <main className="min-h-screen bg-navy-950 px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <Link
          to="/scan/history"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-neon-cyan font-bold transition"
        >
          <ArrowLeft size={18} />
          Back to My Scans
        </Link>

        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <div className="space-y-6 min-w-0">
            <div className="rounded-3xl border border-navy-800 bg-navy-900/70 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-black text-white">
                      Scan Report
                    </h1>

                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300 capitalize">
                      {scan.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-neon-cyan font-bold break-all">
                    <Globe size={20} className="shrink-0" />
                    {scan.target}
                  </div>
                </div>

                <Link
                  to={`/scan/${scanId}/reports`}
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-violet-500/10 px-6 py-3 text-sm font-black text-purple-300 shadow-lg shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white hover:shadow-purple-500/30"
                >
                  <FileText
                    size={18}
                    className="transition-transform duration-300 group-hover:rotate-6"
                  />
                  View All Reports
                  <ExternalLink
                    size={16}
                    className="opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-navy-800 bg-navy-900/70 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div>
                <p className="text-slate-500 text-sm font-bold">Scan Type</p>
                <p className="text-white font-black mt-2 capitalize">
                  {scan.scanType}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm font-bold">Status</p>
                <span className="inline-flex mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300 capitalize">
                  {scan.status}
                </span>
              </div>

              <div>
                <p className="text-slate-500 text-sm font-bold">Started At</p>
                <p className="text-white font-black mt-2 text-sm">
                  {formatDate(scan.startedAt)}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm font-bold">Finished At</p>
                <p className="text-white font-black mt-2 text-sm">
                  {formatDate(scan.finishedAt)}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm font-bold">Duration</p>
                <p className="text-white font-black mt-2">
                  {scan.durationText ||
                    getDurationText(scan.startedAt, scan.finishedAt)}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-navy-800 bg-navy-900/70 p-6">
              <h2 className="text-xl font-black text-white mb-6">Summary</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <SummaryCard
                  title="Total Alerts"
                  value={scan.result.summaryTotal}
                  type="alerts"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <SummaryCard title="High" value={summary.high} type="high" />
                <SummaryCard
                  title="Medium"
                  value={summary.medium}
                  type="medium"
                />
                <SummaryCard title="Low" value={summary.low} type="low" />
                <SummaryCard
                  title="Informational"
                  value={summary.informational}
                  type="info"
                />
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-navy-800 bg-navy-900/70 p-6 py-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-11 w-11 rounded-xl bg-neon-cyan/20 text-neon-cyan flex items-center justify-center">
                  <Bot size={24} />
                </div>

                <h2 className="text-xl font-black text-white">
                  AI Generate Report
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Generate All Vulnerabilities", value: "All" },
                  { title: "Generate High Only", value: "High" },
                  { title: "Generate Medium Only", value: "Medium" },
                  { title: "Generate Low Only", value: "Low" },
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`block rounded-2xl border p-4 cursor-pointer transition ${
                      selectedReportType === item.value
                        ? "border-neon-cyan bg-neon-cyan/10"
                        : "border-navy-700 bg-navy-950/60 hover:border-neon-cyan/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={item.value}
                      checked={selectedReportType === item.value}
                      onChange={() =>
                        setSelectedReportType(item.value as ReportRiskType)
                      }
                      disabled={generatingReport}
                      className="hidden"
                    />

                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                          selectedReportType === item.value
                            ? "border-neon-cyan"
                            : "border-slate-500"
                        }`}
                      >
                        {selectedReportType === item.value && (
                          <span className="h-2.5 w-2.5 rounded-full bg-neon-cyan" />
                        )}
                      </span>

                      <div>
                        <h3 className="text-white font-bold text-sm">
                          {item.title}
                        </h3>

                        <p className="text-slate-400 text-xs mt-2">
                          Generate AI PDF report.
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="mt-6 w-full rounded-xl bg-neon-cyan py-4 text-navy-950 font-black flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generatingReport ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </aside>
        </section>

        <AlertRatioSection summary={summary} />

        <section className="w-full rounded-3xl border border-navy-800 bg-navy-900/70 overflow-hidden">
          <div className="px-6 py-6 border-b border-navy-800">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-black text-white">
                  All Vulnerabilities
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-400">
                  Total: {pagination.total} vulnerabilities
                </p>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <select
                    value={riskFilter}
                    onChange={(e) =>
                      setRiskFilter(e.target.value as RiskFilter)
                    }
                    className="h-11 w-full sm:w-[170px] rounded-xl border border-navy-700 bg-navy-950 px-4 text-sm font-bold text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="All">All Risks</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Informational">Informational</option>
                  </select>

                  <div className="relative w-full sm:w-[280px]">
                    <Search
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search vulnerability..."
                      className="h-11 w-full rounded-xl border border-navy-700 bg-navy-950 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400">
                    Rows per page:
                  </span>

                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="h-11 w-[90px] rounded-xl border border-navy-700 bg-navy-950 px-3 text-sm font-bold text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px]">
            {vulnerabilitiesLoading && (
              <div className="absolute inset-0 z-20 bg-navy-950/70 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex items-center gap-3 rounded-2xl border border-navy-700 bg-navy-900 px-5 py-4 shadow-xl">
                  <Loader2 size={22} className="animate-spin text-neon-cyan" />

                  <span className="text-slate-300 font-bold text-sm">
                    Loading vulnerabilities...
                  </span>
                </div>
              </div>
            )}

            {vulnerabilitiesError && !vulnerabilitiesLoading && (
              <div className="m-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 font-bold">
                {vulnerabilitiesError}
              </div>
            )}

            <div
              className={`w-full transition-opacity duration-200 ${
                vulnerabilitiesLoading ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="hidden xl:block overflow-x-auto">
                <table className="w-full min-w-[1050px] table-fixed">
                  <thead>
                    <tr className="bg-navy-950/70 border-b border-navy-800">
                      <th className="w-[120px] px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                        Risk
                      </th>

                      <th className="w-[230px] px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                        Vulnerability
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                        URL
                      </th>

                      <th className="w-[150px] px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                        Parameter
                      </th>

                      <th className="w-[120px] px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                        Status
                      </th>

                      <th className="w-[160px] px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                        Discovered
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredVulnerabilities.length > 0 ? (
                      filteredVulnerabilities.map((vuln) => (
                        <tr
                          key={vuln._id}
                          className="border-b border-navy-800/80 hover:bg-navy-950/60 transition"
                        >
                          <td className="px-5 py-4 align-top">
                            <span
                              className={`inline-flex rounded-lg border px-3 py-1 text-[11px] font-black ${riskStyle(
                                vuln.risk,
                              )}`}
                            >
                              {vuln.risk}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p className="text-sm font-black text-white break-words">
                              {vuln.alert}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p className="text-sm font-medium text-slate-300 break-all">
                              {vuln.url}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p className="text-sm font-medium text-slate-300 break-words">
                              {vuln.param || "-"}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span className="inline-flex rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-black text-red-300">
                              Open
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p className="text-sm font-bold text-slate-300">
                              {new Date(vuln.createdAt).toLocaleDateString()}
                            </p>

                            <p className="text-xs text-slate-500">
                              {new Date(vuln.createdAt).toLocaleTimeString()}
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <p className="text-slate-400 font-bold">
                            No vulnerabilities found.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="xl:hidden p-4 sm:p-5 space-y-4">
                {filteredVulnerabilities.length > 0 ? (
                  filteredVulnerabilities.map((vuln) => (
                    <div
                      key={vuln._id}
                      className="rounded-2xl border border-navy-800 bg-navy-950/60 p-4 sm:p-5"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span
                          className={`inline-flex rounded-lg border px-3 py-1 text-[11px] font-black ${riskStyle(
                            vuln.risk,
                          )}`}
                        >
                          {vuln.risk}
                        </span>

                        <span className="inline-flex rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-black text-red-300">
                          Open
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
                            Vulnerability
                          </p>

                          <p className="text-sm font-black text-white break-words">
                            {vuln.alert}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
                            URL
                          </p>

                          <p className="text-sm font-medium text-slate-300 break-all">
                            {vuln.url}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
                              Parameter
                            </p>

                            <p className="text-sm font-medium text-slate-300 break-words">
                              {vuln.param || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
                              Discovered
                            </p>

                            <p className="text-sm font-bold text-slate-300">
                              {new Date(vuln.createdAt).toLocaleDateString()}
                            </p>

                            <p className="text-xs text-slate-500">
                              {new Date(vuln.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-16 text-center">
                    <p className="text-slate-400 font-bold">
                      No vulnerabilities found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5 border-t border-navy-800 flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              Showing {startResult} to {endResult} of {pagination.total} results
            </p>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1 || vulnerabilitiesLoading}
                  className="h-10 w-10 rounded-xl border border-navy-700 bg-navy-950/70 text-slate-300 disabled:opacity-40 hover:border-neon-cyan hover:text-neon-cyan transition flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>

                {visiblePages.map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="h-10 w-8 flex items-center justify-center text-slate-500 font-black"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      disabled={vulnerabilitiesLoading}
                      onClick={() => setPage(item)}
                      className={`h-10 w-10 rounded-xl text-sm font-black transition ${
                        page === item
                          ? "bg-neon-cyan text-navy-950"
                          : "border border-navy-700 bg-navy-950/70 text-slate-300 hover:border-neon-cyan hover:text-neon-cyan"
                      } disabled:opacity-40`}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages || vulnerabilitiesLoading}
                  className="h-10 w-10 rounded-xl border border-navy-700 bg-navy-950/70 text-slate-300 disabled:opacity-40 hover:border-neon-cyan hover:text-neon-cyan transition flex items-center justify-center"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
