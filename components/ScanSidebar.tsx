import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  History,
  ChevronRight,
  ShieldAlert,
  Bot,
  Database,
  Home,
  User,
  LogOut,
} from "lucide-react";

type ScanSidebarProps = {
  variant?: "desktop" | "drawer";
  onClose?: () => void;
};

export const ScanSidebar: React.FC<ScanSidebarProps> = ({
  variant = "desktop",
  onClose,
}) => {
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const username = storedUser?.username || "User";

  const menuItems = [
    { label: "Full Scan", path: "/scan", icon: <Search size={20} /> },
    {
      label: "Scan History",
      path: "/scan/history",
      icon: <History size={20} />,
    },
  ];

  const navbarItems = [
    { label: "Home", path: "/", icon: <Home size={20} /> },
    {
      label: "Malware Detection",
      path: "/malware",
      icon: <ShieldAlert size={20} />,
    },
    {
      label: "Data Leak",
      path: "/data-leak",
      icon: <Database size={20} />,
    },
    {
      label: "Chatbot",
      path: "/chatbot",
      icon: <Bot size={20} />,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const navigate = useNavigate();

  const linkClass = (path: string) =>
    `flex items-center justify-between p-4 rounded-xl transition-all group border ${
      isActive(path)
        ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20"
        : "text-slate-400 hover:text-white hover:bg-navy-900 border-transparent"
    }`;

  const handleClose = () => {
    if (variant === "drawer") onClose?.();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`bg-navy-950 border-r border-navy-800 flex-col shrink-0 ${
        variant === "desktop"
          ? "hidden lg:flex fixed left-0 top-0 z-40 w-72 h-screen overflow-y-auto"
          : "flex w-full h-full"
      }`}
    >
      <div className="flex min-h-full flex-col">
        <div className="p-6 border-b border-navy-800">
          <Link
            to="/"
            onClick={handleClose}
            className="flex items-center gap-3 p-3 mb-6 rounded-2xl border border-transparent hover:border-neon-cyan/20 hover:bg-white/5 transition-all group"
          >
            <img
              src="https://i.pinimg.com/474x/68/df/fa/68dffaa31091982813d7de8e855200f3.jpg"
              alt="Black Cat Logo"
              className="w-12 h-12 rounded-xl object-cover border border-neon-cyan/20 shadow-lg shadow-neon-cyan/10"
            />

            <div className="leading-tight">
              <h1 className="text-white font-black uppercase tracking-tight text-lg group-hover:text-neon-cyan transition">
                Black Cat
              </h1>

              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Security Scanner
              </p>
            </div>
          </Link>

          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
            Operations Center
          </h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClose}
                className={linkClass(item.path)}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  {item.icon}
                  {item.label}
                </div>

                <ChevronRight
                  size={14}
                  className={`transition-transform duration-300 ${
                    isActive(item.path)
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-navy-800">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 px-1">
                Quick Access
              </p>

              <div className="space-y-1">
                {navbarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleClose}
                    className={linkClass(item.path)}
                  >
                    <div className="flex items-center gap-3 font-bold text-sm">
                      {item.icon}
                      {item.label}
                    </div>

                    <ChevronRight
                      size={14}
                      className={`transition-transform duration-300 ${
                        isActive(item.path)
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-3">
          <div className="rounded-xl border border-neon-cyan/20 bg-navy-900/80 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
                  <User size={18} />
                </div>

                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-navy-900 bg-green-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Signed in
                </p>

                <h3 className="truncate text-sm font-black text-white">
                  {username}
                </h3>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
