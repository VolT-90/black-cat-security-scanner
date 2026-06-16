import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  Github,
  Chrome,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { loginApi } from "../services/authApi";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginApi(email, password);

      const accessToken = response.data.credentials.access_token;
      const refreshToken = response.data.credentials.refresh_token;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: email.split("@")[0],
        }),
      );

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#030712] px-4 py-8 flex items-center justify-center">
      <div className="absolute top-[-160px] left-[-120px] h-[360px] w-[360px] rounded-full bg-[#5BF3D1]/30 blur-[120px]" />
      <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#67F5D7]/15 blur-[130px]" />

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#5BF3D1_1px,transparent_1px),linear-gradient(to_bottom,#5BF3D1_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5BF3D1]/25 bg-[#5BF3D1]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#5BF3D1] shadow-[0_0_25px_rgba(91,243,209,.18)]">
              <Shield size={15} />
              Black Cat Security
            </div>

            <h1 className="text-6xl font-black text-[#eafffb] leading-[0.95] tracking-tighter">
              Secure Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CF7E0] via-[#67F5D7] to-[#5BF3D1] drop-shadow-[0_0_20px_rgba(91,243,209,.45)]">
                Digital Gate
              </span>
            </h1>

            <p className="max-w-md text-slate-400 text-base leading-7 font-medium">
              Login to access your scanner dashboard, track scan progress,
              review vulnerabilities, and generate AI security reports.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="rounded-3xl border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.04] p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(91,243,209,.12)]">
              <p className="text-3xl font-black text-[#7CF7E0]">AI</p>
              <p className="mt-2 text-sm text-slate-400">
                Smart report generation
              </p>
            </div>

            <div className="rounded-3xl border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.04] p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(91,243,209,.12)]">
              <p className="text-3xl font-black text-[#7CF7E0]">SSE</p>
              <p className="mt-2 text-sm text-slate-400">
                Real-time scan progress
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-4">
            {/* <div className="flex justify-center mb-5">
              <Logo size="lg" />
            </div> */}

            <h2 className="text-4xl font-black text-[#eafffb] uppercase tracking-tighter">
              Welcome{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CF7E0] via-[#67F5D7] to-[#5BF3D1] drop-shadow-[0_0_18px_rgba(91,243,209,.5)]">
                Back
              </span>
            </h2>

            <p className="text-slate-400 mt-2 font-medium">
              Login to continue to your dashboard
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.03] backdrop-blur-2xl shadow-2xl shadow-[#5BF3D1]/20 p-6 sm:p-8">
            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-300 shadow-[0_0_25px_rgba(248,113,113,.15)]">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#5BF3D1] uppercase tracking-[0.22em]">
                  Email Address
                </label>

                <div className="relative group">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5BF3D1] transition"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-4 pl-12 pr-4 text-[#eafffb] outline-none transition-all placeholder:text-slate-600 focus:border-[#5BF3D1] focus:ring-4 focus:ring-[#5BF3D1]/20 focus:shadow-[0_0_25px_rgba(91,243,209,.25)]"
                    placeholder="operator@blackcat.io"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-[#5BF3D1] uppercase tracking-[0.22em]">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[11px] font-black text-[#5BF3D1] hover:text-[#7CF7E0] uppercase tracking-widest transition"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="relative group">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5BF3D1] transition"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-4 pl-12 pr-12 text-[#eafffb] outline-none transition-all placeholder:text-slate-600 focus:border-[#5BF3D1] focus:ring-4 focus:ring-[#5BF3D1]/20 focus:shadow-[0_0_25px_rgba(91,243,209,.25)]"
                    placeholder="••••••••••••"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#5BF3D1] transition"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[linear-gradient(90deg,#67F5D7,#5BF3D1)] py-4 text-[#020617] font-black text-base uppercase tracking-[0.2em] transition-all shadow-[0_0_35px_rgba(91,243,209,.45)] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(91,243,209,.75)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={21} className="animate-spin" />
                    Logging In
                  </>
                ) : (
                  <>
                    Initialize Login
                    <LogIn size={21} />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#5BF3D1]/20" />
              <span className="text-[10px] font-black text-[#5BF3D1] uppercase tracking-[0.3em]">
                Or
              </span>
              <div className="h-px flex-1 bg-[#5BF3D1]/20" />
            </div>

            <div>
              <button
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-4 text-sm font-black uppercase tracking-widest text-slate-300 transition-all hover:border-[#5BF3D1] hover:bg-[#5BF3D1]/10 hover:text-[#7CF7E0] hover:shadow-[0_0_25px_rgba(91,243,209,.35)] hover:scale-[1.01]"
              >
                <Chrome size={20} />
                Continue with Google
              </button>
            </div>

            <p className="mt-7 text-center text-sm text-slate-500">
              New to Black Cat?{" "}
              <Link
                to="/register"
                className="font-black text-[#5BF3D1] hover:text-[#7CF7E0] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[#5BF3D1]/70 text-[10px] font-black uppercase tracking-[0.25em]">
            <Shield size={13} className="text-[#5BF3D1]" />
            Encrypted Authentication
          </div>
        </div>
      </section>
    </main>
  );
};
