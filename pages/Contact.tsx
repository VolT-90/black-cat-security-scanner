
import React from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send, Globe, LifeBuoy } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-black tracking-widest uppercase">
              <LifeBuoy size={14} /> Support Center
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Request <span className="text-neon-cyan">Reinforcements</span></h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">Need help with a scan? Our expert security team is standing by 24/7 to help you secure your perimeter.</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="bg-navy-800 p-4 rounded-2xl group-hover:bg-neon-cyan group-hover:text-navy-900 transition-all">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tight italic">Email Response</h4>
                <p className="text-slate-500 text-sm">support@blackcat-security.io</p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="bg-navy-800 p-4 rounded-2xl group-hover:bg-neon-cyan group-hover:text-navy-900 transition-all">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tight italic">Hotline Support</h4>
                <p className="text-slate-500 text-sm">+1 (888) SEC-VOID</p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="bg-navy-800 p-4 rounded-2xl group-hover:bg-neon-cyan group-hover:text-navy-900 transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tight italic">Global HQ</h4>
                <p className="text-slate-500 text-sm">Level 42, Cyber Tower 1, Neo Tokyo</p>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-navy-800">
            <div className="flex gap-4">
              <div className="h-1 w-12 bg-neon-cyan rounded-full"></div>
              <div className="h-1 w-4 bg-navy-800 rounded-full"></div>
              <div className="h-1 w-4 bg-navy-800 rounded-full"></div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-4">Security Redundancy Protocol Active</p>
          </div>
        </div>

        <div className="glass p-10 md:p-14 rounded-[3rem] border-t-2 border-neon-cyan animate-in fade-in slide-in-from-right-6 duration-700">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Ident Name</label>
                <input type="text" className="w-full bg-navy-950 border border-navy-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Sector Email</label>
                <input type="email" className="w-full bg-navy-950 border border-navy-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Issue Category</label>
              <select className="w-full bg-navy-950 border border-navy-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all appearance-none cursor-pointer">
                <option>Scanner Technical Issue</option>
                <option>Billing Inquiry</option>
                <option>API Support</option>
                <option>Pentest Request</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Transmission Message</label>
              <textarea rows={4} className="w-full bg-navy-950 border border-navy-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all resize-none"></textarea>
            </div>
            <button className="w-full bg-neon-cyan text-navy-900 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-neon-cyan/10">
              SEND TRANSMISSION <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
