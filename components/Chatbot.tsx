
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { getSecurityAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Hello! I am the Black Cat Security Assistant. How can I help you secure your digital assets today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getSecurityAssistantResponse([...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'model', content: response || "I'm sorry, I couldn't process that. Please try again." }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="glass w-80 sm:w-96 h-[500px] flex flex-col rounded-2xl shadow-2xl border border-neon-cyan/20 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300">
          <div className="bg-navy-800 p-4 flex items-center justify-between border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="bg-neon-cyan/10 p-2 rounded-full">
                <Bot size={20} className="text-neon-cyan" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Security Assistant</h3>
                <span className="text-[10px] text-neon-cyan uppercase tracking-widest font-bold">Black Cat AI</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-neon-cyan text-navy-900' : 'bg-navy-700 text-neon-cyan'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-neon-cyan text-navy-900 font-medium' 
                      : 'bg-navy-800 text-slate-200 border border-navy-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-navy-800 p-3 rounded-2xl flex items-center gap-2 border border-navy-700">
                  <Loader2 size={16} className="text-neon-cyan animate-spin" />
                  <span className="text-xs text-slate-400">Analysing security context...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-navy-800 border-t border-navy-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about vulnerabilities..."
                className="w-full bg-navy-900 border border-navy-700 rounded-full py-2.5 px-4 pr-12 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-neon-cyan text-navy-900 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-neon-cyan text-navy-900 p-4 rounded-full shadow-lg shadow-neon-cyan/20 hover:scale-110 active:scale-95 transition-all animate-bounce"
        >
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};
