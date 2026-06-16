import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function DataLeak() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  const scrollToResult = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  const handleScan = useCallback(async () => {
    if (!email.trim() || !isValidEmail) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://black-cat.up.railway.app/user/check-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Request failed");

      setResult({
        leaked: data?.data?.leaked,
        email: data?.data?.email,
        status: data?.data?.status,
        severity: data?.data?.severity,
        message: data?.message,
        details: data?.data?.details,
        recommendations: data?.data?.recommendations || [],
      });

      scrollToResult();
    } catch (error: any) {
      setResult({
        leaked: true,
        error: true,
        message: error.message || "Something went wrong",
        recommendations: ["Please try again later."],
      });

      scrollToResult();
    } finally {
      setLoading(false);
    }
  }, [email, isValidEmail]);

  const danger = result?.leaked;

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
                <Shield className="h-12 w-12 text-neon-cyan" />
              </div>

              <h1 className="text-6xl font-black tracking-tight">
                <span className="text-white">Data </span>
                <span className="bg-gradient-to-r from-neon-cyan to-cyan-300 bg-clip-text text-transparent">
                  Leak
                </span>
              </h1>

              <p className="mt-4 text-lg text-slate-400">
                Check whether your email has appeared in leaked records.
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
                    <Mail className="h-5 w-5 text-neon-cyan" />
                  </div>

                  <div>
                    <h2 className="font-bold">Email Exposure Check</h2>
                    <p className="text-sm text-slate-400">
                      Enter your email and scan leaked database records.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      placeholder="youremail@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-[#020617] py-4 pl-12 pr-4 text-white outline-none transition focus:border-neon-cyan"
                    />
                  </div>

                  <motion.button
                    whileHover={
                      !loading && isValidEmail ? { scale: 1.03 } : undefined
                    }
                    whileTap={
                      !loading && isValidEmail ? { scale: 0.97 } : undefined
                    }
                    disabled={loading || !isValidEmail}
                    onClick={handleScan}
                    className={`rounded-2xl px-8 py-4 font-black transition ${
                      loading || !isValidEmail
                        ? "cursor-not-allowed bg-slate-700 text-slate-400"
                        : "bg-neon-cyan text-navy-900 shadow-[0_0_35px_rgba(0,255,255,0.35)] hover:bg-neon-cyan/90"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Checking
                      </span>
                    ) : (
                      "Check Now"
                    )}
                  </motion.button>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Lock className="h-4 w-4" />
                  Your email is only used for this security check.
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div
                  ref={resultRef}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 32 }}
                  className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]"
                >
                  <div
                    className={`rounded-[2rem] border p-7 shadow-2xl backdrop-blur-xl ${
                      danger
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-emerald-500/30 bg-emerald-500/10"
                    }`}
                  >
                    <div className="mb-5 flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          danger ? "bg-red-500/15" : "bg-emerald-500/15"
                        }`}
                      >
                        {danger ? (
                          <AlertTriangle className="h-8 w-8 text-red-400" />
                        ) : (
                          <CheckCircle className="h-8 w-8 text-emerald-400" />
                        )}
                      </div>

                      <div>
                        <h2
                          className={`text-2xl font-black ${
                            danger ? "text-red-300" : "text-emerald-300"
                          }`}
                        >
                          {danger ? "Email Compromised" : "No Leak Found"}
                        </h2>

                        <p className="text-sm text-slate-400">
                          {result.email || email}
                        </p>
                      </div>
                    </div>

                    <p className="leading-relaxed text-slate-300">
                      {result.message}
                    </p>

                    {result.details && (
                      <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-slate-400">
                        {result.details}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      {result.status && (
                        <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm uppercase">
                          Status: {result.status}
                        </span>
                      )}

                      {result.severity && (
                        <span
                          className={`rounded-full px-4 py-2 text-sm uppercase ${
                            danger
                              ? "bg-red-500/20 text-red-300"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          Severity: {result.severity}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl">
                    <h3 className="mb-5 text-xl font-black text-neon-cyan">
                      Recommended Actions
                    </h3>

                    <div className="space-y-3">
                      {result.recommendations.map(
                        (item: string, index: number) => (
                          <div
                            key={index}
                            className="flex gap-3 rounded-2xl border border-white/10 bg-[#0b1224]/80 p-4 text-sm text-slate-300"
                          >
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neon-cyan/15 text-neon-cyan">
                              {index + 1}
                            </span>

                            <p>{item}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}