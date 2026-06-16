import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  FileText,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Info,
  Sparkles,
  ExternalLink,
  Trash2,
  Globe,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  Circle,
  FileDown,
  ArrowRight,
} from "lucide-react";

import { getScanResult } from "@/services/ScanReportApi";
import { getReportsByScan, deleteReport } from "@/services/ReportApi";

type ReportStatus = "PROCESSING" | "COMPLETED" | "FAILED" | "PENDING";
type ReportType = "All" | "High" | "Medium" | "Low" | "Informational";

type Report = {
  _id: string;
  scanId: string;
  userId: string;
  typeOfRisk: ReportType;
  reportName: string;
  fileUrl: string | null;
  cloudinaryPublicId: string | null;
  status: ReportStatus;
  generationTimeMs: number | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
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

const reportDescriptions: Record<ReportType, string> = {
  All: "Comprehensive overview of all vulnerabilities and risks.",
  High: "Detailed report for high severity vulnerabilities.",
  Medium: "Detailed report for medium severity vulnerabilities.",
  Low: "Detailed report for low severity vulnerabilities.",
  Informational: "Informational findings and best practice suggestions.",
};

const statusStyle = (status: ReportStatus) => {
  if (status === "COMPLETED") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "PROCESSING") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  if (status === "FAILED") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
};

const scanStatusStyle = (status?: string) => {
  const value = status?.toLowerCase();

  if (value === "completed") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (value === "failed") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  if (value === "scanning" || value === "processing" || value === "preparing") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
};

const riskStyle = (risk: ReportType) => {
  if (risk === "High") return "border-red-500/30 bg-red-500/10 text-red-300";
  if (risk === "Medium")
    return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  if (risk === "Low")
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  if (risk === "Informational")
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";

  return "border-purple-500/30 bg-purple-500/10 text-purple-300";
};

const getReportIcon = (risk: ReportType) => {
  if (risk === "High") return <AlertTriangle size={18} />;
  if (risk === "Medium") return <ShieldAlert size={18} />;
  if (risk === "Low") return <Info size={18} />;
  if (risk === "Informational") return <Info size={18} />;

  return <FileText size={18} />;
};

const getStatusIcon = (status: ReportStatus) => {
  if (status === "COMPLETED") return <CheckCircle2 size={13} />;
  if (status === "PROCESSING")
    return <Loader2 size={13} className="animate-spin" />;
  if (status === "FAILED") return <XCircle size={13} />;

  return <Circle size={13} />;
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleString();
};

const formatGenerationTime = (ms: number | null) => {
  if (!ms) return "-";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (minutes === 0) return `${restSeconds}s`;

  return `${minutes}m ${restSeconds}s`;
};

const successToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95"
        } transform transition-all duration-500 ease-out flex w-[380px] max-w-[95vw] items-start gap-4 rounded-2xl border border-emerald-400/20 bg-[#07111f]/95 p-4 shadow-[0_0_30px_rgba(16,185,129,.15)] backdrop-blur-xl`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
          <CheckCircle2 size={22} />
        </div>

        <div className="flex-1">
          <h3 className="font-black text-white">Success</h3>
          <p className="mt-1 text-sm font-bold leading-5 text-slate-300">
            {message}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <XCircle size={18} />
        </button>
      </div>
    ),
    {
      duration: 5000,
      position: "top-center",
    },
  );
};

const errorToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95"
        } transform transition-all duration-500 ease-out flex w-[380px] max-w-[95vw] items-start gap-4 rounded-2xl border border-red-500/20 bg-[#07111f]/95 p-4 shadow-[0_0_30px_rgba(239,68,68,.15)] backdrop-blur-xl`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300">
          <XCircle size={22} />
        </div>

        <div className="flex-1">
          <h3 className="font-black text-white">Error</h3>
          <p className="mt-1 text-sm font-bold leading-5 text-slate-300">
            {message}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <XCircle size={18} />
        </button>
      </div>
    ),
    {
      duration: 5000,
      position: "top-center",
    },
  );
};

export const ScanReports: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();

  const [scan, setScan] = useState<ScanDetails | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  const [loading, setLoading] = useState(true);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const fetchPageData = async () => {
    if (!scanId) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const [scanResponse, reportsResponse] = await Promise.all([
        getScanResult(scanId),
        getReportsByScan(scanId),
      ]);

      setScan(scanResponse.data.data);
      setReports(reportsResponse.data.data || []);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.err_message ||
          "Failed to load scan reports",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      setDeletingReportId(reportId);

      const response = await deleteReport(reportId);

      setReports((prev) => prev.filter((report) => report._id !== reportId));

      successToast(response?.data?.message || "Report deleted successfully.");
    } catch (error: any) {
      errorToast(
        error?.response?.data?.err_message ||
          error?.response?.data?.message ||
          "Failed to delete report.",
      );
    } finally {
      setDeletingReportId(null);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [scanId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={42} className="animate-spin text-neon-cyan" />
          <p className="text-slate-400 font-bold">Loading reports...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy-950 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <button
          onClick={() => navigate("/scan/history")}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-neon-cyan font-bold transition"
        >
          <ArrowLeft size={16} />
          Back to Scans
        </button>

        {errorMessage && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300 font-bold">
            {errorMessage}
          </div>
        )}

        {scan && (
          <section className="rounded-2xl border border-navy-800 bg-navy-900/70 p-4 shadow-2xl shadow-black/20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck size={26} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-black text-white break-all">
                    {scan.target} Scan
                  </h1>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 font-bold break-all">
                    <Globe size={14} className="shrink-0" />
                    {scan.result?.baseUrl || scan.target}
                  </div>
                </div>
              </div>

              <Link
                to={`/scan/${scanId}/report`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 text-xs font-black text-neon-cyan shadow-lg shadow-neon-cyan/10 transition hover:-translate-y-0.5 hover:border-neon-cyan hover:bg-neon-cyan hover:text-navy-950 hover:shadow-neon-cyan/25"
              >
                <ExternalLink
                  size={15}
                  className="transition group-hover:rotate-12"
                />
                View Scan Details
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Activity size={13} />
                  <p className="text-xs font-bold">Scan Type</p>
                </div>
                <p className="mt-1 text-sm text-white font-bold capitalize">
                  {scan.scanType}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck size={13} />
                  <p className="text-xs font-bold">Status</p>
                </div>
                <span
                  className={`inline-flex mt-1 rounded-lg border px-2 py-0.5 text-[11px] font-black capitalize ${scanStatusStyle(
                    scan.status,
                  )}`}
                >
                  {scan.status}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar size={13} />
                  <p className="text-xs font-bold">Started At</p>
                </div>
                <p className="mt-1 text-sm text-white font-bold">
                  {formatDate(scan.startedAt)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={13} />
                  <p className="text-xs font-bold">Duration</p>
                </div>
                <p className="mt-1 text-sm text-white font-bold">
                  {scan.durationText || "-"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Sparkles size={13} />
                  <p className="text-xs font-bold">Total Alerts</p>
                </div>
                <p className="mt-1 text-sm text-white font-bold">
                  {scan.result?.summaryTotal ?? 0}
                </p>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">AI Reports</h2>
            <Info size={16} className="text-slate-500" />
          </div>

          <p className="mt-1 text-xs font-bold text-slate-400">
            View and manage AI-powered security reports for this scan.
          </p>
        </section>

        <section className="rounded-2xl border border-navy-800 bg-navy-900/70 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-navy-800 bg-navy-950/70">
                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Report
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Type of Risk
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Generated At
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr
                      key={report._id}
                      className={`border-b border-navy-800/80 hover:bg-navy-950/50 transition ${
                        deletingReportId === report._id
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-xl border flex items-center justify-center ${riskStyle(
                              report.typeOfRisk,
                            )}`}
                          >
                            {getReportIcon(report.typeOfRisk)}
                          </div>

                          <div>
                            <h3 className="text-sm text-white font-black">
                              {report.reportName}
                            </h3>

                            <p className="mt-0.5 max-w-xs text-[11px] text-slate-400 font-bold leading-4">
                              {reportDescriptions[report.typeOfRisk] ||
                                "AI generated security report."}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-lg border px-2 py-1 text-[11px] font-black ${riskStyle(
                            report.typeOfRisk,
                          )}`}
                        >
                          {report.typeOfRisk === "All"
                            ? "All Risks"
                            : report.typeOfRisk}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-[11px] font-black ${statusStyle(
                            report.status,
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <p className="text-xs font-bold text-slate-300">
                          {formatDate(report.createdAt)}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {formatGenerationTime(report.generationTimeMs)}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {report.status === "COMPLETED" && report.fileUrl ? (
                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-2 text-xs font-black text-purple-300 hover:bg-purple-500 hover:text-white transition"
                            >
                              <ExternalLink size={14} />
                              Open PDF
                            </a>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-950/70 px-3 py-2 text-xs font-black text-slate-500 cursor-not-allowed"
                            >
                              <FileDown size={14} />
                              Open PDF
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            disabled={deletingReportId === report._id}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {deletingReportId === report._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>

                        {report.status === "FAILED" && report.failureReason && (
                          <p className="mt-1 text-[11px] font-bold text-red-300">
                            {report.failureReason}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <p className="text-slate-400 font-bold">
                        No reports found for this scan.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden p-4 space-y-4">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div
                  key={report._id}
                  className={`rounded-2xl border border-navy-800 bg-navy-950/60 p-5 transition ${
                    deletingReportId === report._id
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${riskStyle(
                        report.typeOfRisk,
                      )}`}
                    >
                      {getReportIcon(report.typeOfRisk)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-black">
                        {report.reportName}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 font-bold">
                        {reportDescriptions[report.typeOfRisk] ||
                          "AI generated security report."}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-lg border px-3 py-1 text-xs font-black ${riskStyle(
                            report.typeOfRisk,
                          )}`}
                        >
                          {report.typeOfRisk}
                        </span>

                        <span
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-black ${statusStyle(
                            report.status,
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-400 font-bold">
                        {formatDate(report.createdAt)}
                      </p>

                      <div className="mt-4 space-y-3">
                        {report.status === "COMPLETED" && report.fileUrl ? (
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-3 text-sm font-black text-purple-300 transition hover:bg-purple-500 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20"
                          >
                            <ExternalLink size={16} />
                            Open PDF
                          </a>
                        ) : (
                          <button
                            disabled
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-navy-700 bg-navy-900 px-4 py-3 text-sm font-black text-slate-500"
                          >
                            <FileDown size={16} />
                            Open PDF
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteReport(report._id)}
                          disabled={deletingReportId === report._id}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {deletingReportId === report._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete Report
                        </button>
                      </div>

                      {report.status === "FAILED" && report.failureReason && (
                        <p className="mt-3 text-xs font-bold text-red-300">
                          {report.failureReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-12 text-center text-slate-400 font-bold">
                No reports found for this scan.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-navy-700/70 bg-navy-900/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-yellow-300">
                <Sparkles size={16} />
              </div>

              <div>
                <h3 className="text-sm font-black text-white">How it works</h3>
                <p className="mt-1 max-w-[250px] text-[11px] font-medium leading-4 text-slate-400">
                  Reports are generated using AI based on the vulnerabilities
                  found in this scan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-[11px] font-black text-white">
                1
              </div>

              <div>
                <h4 className="text-xs font-black text-white">
                  Choose report type
                </h4>
                <p className="mt-1 max-w-[180px] text-[11px] leading-4 text-slate-400">
                  Select the type of risk you want to include.
                </p>
              </div>
            </div>

            <ArrowRight className="hidden text-slate-600 lg:block" size={24} />

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-[11px] font-black text-white">
                2
              </div>

              <div>
                <h4 className="text-xs font-black text-white">
                  AI is generating
                </h4>
                <p className="mt-1 max-w-[190px] text-[11px] leading-4 text-slate-400">
                  We analyze the findings and create your report.
                </p>
              </div>
            </div>

            <ArrowRight className="hidden text-slate-600 lg:block" size={24} />

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-[11px] font-black text-white">
                3
              </div>

              <div>
                <h4 className="text-xs font-black text-white">
                  Download & Share
                </h4>
                <p className="mt-1 max-w-[190px] text-[11px] leading-4 text-slate-400">
                  Download the PDF report or share it with your team.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
              <FileText size={30} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
