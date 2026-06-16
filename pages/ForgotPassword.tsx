import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Send,
  KeyRound,
  LockKeyhole,
} from "lucide-react";

export const ForgotPassword: React.FC = () => {
  return (
    <main className="relative h-[calc(100vh-80px)] overflow-hidden bg-[#030712] px-4 flex items-center justify-center">
      <div className="absolute top-[-160px] left-[-120px] h-[340px] w-[340px] rounded-full bg-[#5BF3D1]/30 blur-[120px]" />
      <div className="absolute bottom-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#67F5D7]/15 blur-[130px]" />

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#5BF3D1_1px,transparent_1px),linear-gradient(to_bottom,#5BF3D1_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5BF3D1]/25 bg-[#5BF3D1]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#5BF3D1] shadow-[0_0_25px_rgba(91,243,209,.18)]">
              <ShieldCheck size={15} />
              Black Cat Security
            </div>

            <h1 className="text-5xl font-black text-[#eafffb] leading-[0.95] tracking-tighter">
              Reset
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CF7E0] via-[#67F5D7] to-[#5BF3D1] drop-shadow-[0_0_20px_rgba(91,243,209,.45)]">
                Your Access
              </span>
            </h1>

            <p className="max-w-md text-slate-400 text-sm leading-6 font-medium">
              Enter your registered email address and we will help you recover
              access to your Black Cat account securely.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="rounded-3xl border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.04] p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(91,243,209,.12)]">
              <p className="text-2xl font-black text-[#7CF7E0]">OTP</p>
              <p className="mt-1 text-sm text-slate-400">
                Email reset code
              </p>
            </div>

            <div className="rounded-3xl border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.04] p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(91,243,209,.12)]">
              <p className="text-2xl font-black text-[#7CF7E0]">SAFE</p>
              <p className="mt-1 text-sm text-slate-400">
                Protected recovery
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-black text-[#eafffb] uppercase tracking-tighter">
              Reset{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CF7E0] via-[#67F5D7] to-[#5BF3D1] drop-shadow-[0_0_18px_rgba(91,243,209,.5)]">
                Access
              </span>
            </h2>

            <p className="text-slate-400 mt-1 text-sm font-medium">
              Enter your email to receive a reset code
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#5BF3D1]/20 bg-[#5BF3D1]/[0.03] backdrop-blur-2xl shadow-2xl shadow-[#5BF3D1]/20 p-5">
            <form className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f]/80 p-3 shadow-[0_0_20px_rgba(91,243,209,.08)]">
                <KeyRound
                  size={18}
                  className="text-[#5BF3D1] shrink-0 mt-0.5"
                />

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  We will send a secure recovery code to your email. Use it to
                  verify your identity and reset your password.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#5BF3D1] uppercase tracking-[0.22em]">
                  Email Address
                </label>

                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5BF3D1] transition"
                  />

                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-2xl border border-[#5BF3D1]/20 bg-[#07111f] py-3 pl-12 pr-4 text-[#eafffb] outline-none transition-all placeholder:text-slate-600 focus:border-[#5BF3D1] focus:ring-4 focus:ring-[#5BF3D1]/20 focus:shadow-[0_0_25px_rgba(91,243,209,.25)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[linear-gradient(90deg,#67F5D7,#5BF3D1)] py-3 text-[#020617] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_0_35px_rgba(91,243,209,.45)] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(91,243,209,.75)] active:scale-95 flex items-center justify-center gap-3"
              >
                Send Reset Code
                <Send size={20} />
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#5BF3D1] transition-colors font-black uppercase tracking-wider"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>

              <div className="flex items-center gap-2 text-[#5BF3D1]/70 text-[10px] font-black uppercase tracking-[0.2em]">
                <LockKeyhole size={13} className="text-[#5BF3D1]" />
                Encrypted
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};