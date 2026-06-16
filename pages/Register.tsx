import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { signupApi } from "../services/authApi";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signupApi(
        username.trim(),
        email.trim(),
        password,
        confirmPassword
      );

      navigate("/otp", {
        state: { email: email.trim() },
      });
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-[calc(100vh-80px)] overflow-hidden bg-[#030712] px-4 flex items-center justify-center">
      <div className="absolute top-[-160px] left-[-120px] h-[340px] w-[340px] rounded-full bg-[#5BF3D1]/30 blur-[120px]" />
      <div className="absolute bottom-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#67F5D7]/15 blur-[130px]" />

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#5BF3D1_1px,transparent_1px),linear-gradient(to_bottom,#5BF3D1_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5BF3D1]/25 bg-[#5BF3D1]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#5BF3D1] shadow-[0_0_25px_rgba(91,243,209,.18)]">
              <ShieldCheck size={15} />
              Black Cat Security
            </div>

            <h1 className="text-5xl font-black text-[#eafffb] leading-[0.95] tracking-tighter">
              Join the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CF7E0] via-[#67F5D7] to-[#5BF3D1] drop-shadow-[0_0_20px_rgba(91,243,209,.45)]">
                Resistance
              </span>
            </h1>

            <p className="max-w-md text-slate-400 text-sm leading-6 font-medium">
              Create your account to access scan history, monitor security
              reports, and manage your Black Cat dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="rounded-3xl border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.04] p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(91,243,209,.12)]">
              <p className="text-2xl font-black text-[#7CF7E0]">OTP</p>
              <p className="mt-1 text-sm text-slate-400">
                Email verification flow
              </p>
            </div>

            <div className="rounded-3xl border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.04] p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(91,243,209,.12)]">
              <p className="text-2xl font-black text-[#7CF7E0]">JWT</p>
              <p className="mt-1 text-sm text-slate-400">
                Secure authentication
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-black text-[#eafffb] uppercase tracking-tighter">
              Create{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CF7E0] via-[#67F5D7] to-[#5BF3D1] drop-shadow-[0_0_18px_rgba(91,243,209,.5)]">
                Account
              </span>
            </h2>

            <p className="text-slate-400 mt-1 text-sm font-medium">
              Deploy advanced security for your team
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.03] backdrop-blur-2xl shadow-2xl shadow-[#5BF3D1]/20 p-5">
            <form onSubmit={handleRegister} className="space-y-3">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-300 shadow-[0_0_25px_rgba(248,113,113,.15)]">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#5BF3D1] uppercase tracking-[0.22em]">
                  Username
                </label>

                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5BF3D1] transition"
                  />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-3 pl-12 pr-4 text-[#eafffb] outline-none transition-all placeholder:text-slate-600 focus:border-[#5BF3D1] focus:ring-4 focus:ring-[#5BF3D1]/20 focus:shadow-[0_0_25px_rgba(91,243,209,.25)]"
                    placeholder="Omar Ewis"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#5BF3D1] uppercase tracking-[0.22em]">
                  Command Center Email
                </label>

                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5BF3D1] transition"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-3 pl-12 pr-4 text-[#eafffb] outline-none transition-all placeholder:text-slate-600 focus:border-[#5BF3D1] focus:ring-4 focus:ring-[#5BF3D1]/20 focus:shadow-[0_0_25px_rgba(91,243,209,.25)]"
                    placeholder="contact@hq.security"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#5BF3D1] uppercase tracking-[0.22em]">
                  Encryption Secret
                </label>

                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5BF3D1] transition"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-3 pl-12 pr-4 text-[#eafffb] outline-none transition-all placeholder:text-slate-600 focus:border-[#5BF3D1] focus:ring-4 focus:ring-[#5BF3D1]/20 focus:shadow-[0_0_25px_rgba(91,243,209,.25)]"
                    placeholder="Minimum 8 characters"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#5BF3D1] uppercase tracking-[0.22em]">
                  Confirm Encryption Secret
                </label>

                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5BF3D1] transition"
                  />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-3 pl-12 pr-4 text-[#eafffb] outline-none transition-all placeholder:text-slate-600 focus:border-[#5BF3D1] focus:ring-4 focus:ring-[#5BF3D1]/20 focus:shadow-[0_0_25px_rgba(91,243,209,.25)]"
                    placeholder="Repeat your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f]/80 p-3 shadow-[0_0_20px_rgba(91,243,209,.08)]">
                <ShieldCheck
                  size={18}
                  className="text-[#5BF3D1] shrink-0 mt-0.5"
                />

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <span className="text-[#eafffb] hover:text-[#5BF3D1] hover:underline cursor-pointer transition">
                    Service Protocols
                  </span>{" "}
                  and{" "}
                  <span className="text-[#eafffb] hover:text-[#5BF3D1] hover:underline cursor-pointer transition">
                    Security Policies
                  </span>
                  .
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[linear-gradient(90deg,#67F5D7,#5BF3D1)] py-3 text-[#020617] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_0_35px_rgba(91,243,209,.45)] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(91,243,209,.75)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating
                  </>
                ) : (
                  <>
                    Deploy Account
                    <UserPlus size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-500">
                Already part of Black Cat?{" "}
                <Link
                  to="/login"
                  className="font-black text-[#5BF3D1] hover:text-[#7CF7E0] hover:underline"
                >
                  Access Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};