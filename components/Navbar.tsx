import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Shield,
  Search,
  Mail,
  UserPlus,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("accessToken");

  const isLoggedIn = Boolean(token);

  const navItems = [
    { label: "Home", path: "/", icon: Shield },
    { label: "Scanner", path: "/scan", icon: Search },
    { label: "Malware", path: "/malware", icon: Shield },
    { label: "Data Leak", path: "/data-leak", icon: Mail },
    { label: "Chatbot", path: "/chatbot", icon: MessageSquare },
    // { label: "Contact", path: "/contact", icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";

    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setIsUserOpen(false);
    setIsOpen(false);

    navigate('/login')
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setIsUserOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserOpen((prev) => !prev);

    if (!isUserOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/85 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      {/* Glow Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_28%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link
            to="/"
            className="group flex flex-col items-center justify-center shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-neon-cyan/30 blur-2xl group-hover:bg-neon-cyan/40 transition-all duration-500" />

              <img
                src="https://i.pinimg.com/474x/68/df/fa/68dffaa31091982813d7de8e855200f3.jpg"
                alt="Black Cat Logo"
                className="relative h-14 w-14 rounded-full object-cover border border-neon-cyan/40 shadow-[0_0_30px_rgba(34,211,238,0.45)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_45px_rgba(34,211,238,0.7)]"
              />
            </div>

            <span className="mt-1 text-[11px] font-black tracking-[0.4em] uppercase text-neon-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
              Black Cat
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/[0.03] p-1.5 shadow-inner shadow-neon-cyan/10">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                        : "border-transparent text-slate-300 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 hover:text-neon-cyan"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 ${
                        active
                          ? "border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan"
                          : "border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-neon-cyan/40 group-hover:text-neon-cyan"
                      }`}
                    >
                      <Icon size={17} strokeWidth={2.3} />
                    </span>

                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserOpen(!isUserOpen)}
                    className="group flex items-center gap-3 rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2.5 text-sm font-semibold text-neon-cyan transition-all duration-300 hover:bg-neon-cyan/15"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/15">
                      <User size={18} />
                    </span>

                    <div className="text-left">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="max-w-[120px] truncate font-bold">
                        {user?.username || user?.name || "User"}
                      </p>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        isUserOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isUserOpen && (
                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-neon-cyan/20 bg-[#07111f]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.15)]">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-4 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                          <LogOut size={17} />
                        </span>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 hover:text-neon-cyan"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-neon-cyan/40 group-hover:text-neon-cyan">
                      <LogIn size={17} strokeWidth={2.3} />
                    </span>
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="group flex items-center gap-2 rounded-2xl border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2.5 text-sm font-bold text-neon-cyan shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all duration-300 hover:bg-neon-cyan hover:text-[#030712]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-cyan/15">
                      <UserPlus size={17} strokeWidth={2.3} />
                    </span>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:border-neon-cyan/40 hover:bg-neon-cyan/10 hover:text-neon-cyan"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* User Button */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan transition-all hover:border-neon-cyan/40 hover:bg-neon-cyan/10"
                >
                  <User size={22} strokeWidth={2.3} />
                </button>

                {isUserOpen && (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-neon-cyan/20 bg-[#07111f]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.15)]">
                    <div className="border-b border-neon-cyan/10 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Signed in as
                      </p>

                      <p className="mt-2 text-base font-bold text-neon-cyan">
                        {user?.username || user?.name || "User"}
                      </p>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                        <LogOut size={17} />
                      </span>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-neon-cyan/10 bg-[#030712]/95 backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-4 rounded-2xl border px-4 py-3.5 text-base font-semibold transition-all duration-300 ${
                    active
                      ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 hover:text-neon-cyan"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                      active
                        ? "border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan"
                        : "border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-neon-cyan/40 group-hover:text-neon-cyan"
                    }`}
                  >
                    <Icon size={19} strokeWidth={2.3} />
                  </span>

                  {item.label}
                </Link>
              );
            })}
            {!isLoggedIn && (
              <div className="pt-3 space-y-3 border-t border-neon-cyan/10 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base font-semibold text-slate-300 transition-all duration-300 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 hover:text-neon-cyan"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-neon-cyan/40 group-hover:text-neon-cyan">
                    <LogIn size={19} strokeWidth={2.3} />
                  </span>
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-4 rounded-2xl border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-3.5 text-base font-bold text-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:bg-neon-cyan hover:text-[#030712]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/15">
                    <UserPlus size={19} strokeWidth={2.3} />
                  </span>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
