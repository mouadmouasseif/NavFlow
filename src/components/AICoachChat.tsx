import React, { useState, useRef, useEffect } from 'react';
import { SailingSession, Message } from '../types';
import { Send, Sparkles, MessageSquareDot, HelpCircle, Loader2, Award, ClipboardCheck, Download, ShieldAlert } from 'lucide-react';

interface AICoachChatProps {
  session: SailingSession;
}

const SUGGESTIONS = [
  "How can I improve my hiking posture limit?",
  "Analyze current sail trim errors",
  "Calculate my VMG target in 15kts",
  "Summarize Tangier wave crest limits"
];

export default function AICoachChat({ session }: AICoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: `Ahlan! I am **SailMotion Intelligence**, your AI coach created by **Mouad Mouasseif**. 

I am tracking your performance on the **${session.boatType}** at **${session.location}**. 
Looking at your telemetry logs, your peak speed hit **${session.telemetry.maxSpeed}** with active hiking extension of **${session.telemetry.hikingAngle}**.

Ask me any specific tactical, aerodynamic, or biomechanical questions about your workout!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message sending to server-side Gemini
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          })),
          sessionContext: session
        })
      });

      const data = await response.json();
      
      const coachMsg: Message = {
        id: `coach-${Date.now()}`,
        role: "model",
        content: data.text || "I apologize, our telemetry uplink experienced a slight draft stall. Let's inspect your posture matrices.",
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error("SailMotion: Chat transmission error:", err);
      // Fallback
      setMessages(prev => [...prev, {
        id: `coach-fallback-${Date.now()}`,
        role: "model",
        content: `**Dynamic Sailing Advisory Engine:**\n\nTo lock down performance in these conditions, please pay direct attention to your hiking extension. Keep your cockpit floor empty and sync your sheet plays instantly.`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Compile detailed custom report
  const handleCompileReport = async () => {
    setIsGeneratingReport(true);
    setActiveReport(null);

    try {
      const response = await fetch('/api/coach/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session })
      });

      const data = await response.json();
      setActiveReport(data.text);
    } catch (err) {
      console.error("SailMotion: Report compile failed:", err);
      setActiveReport(session.aiReport || "Failed to generate report text. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="ai-coach-grid-panel">
      
      {/* 1. Chat Interface (Column span 2) */}
      <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-[480px] xl:col-span-2 overflow-hidden">
        
        {/* Header bar */}
        <div className="bg-navy-950/80 px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green shadow shadow-neon-green/10 font-bold font-display">
                MM
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-navy-900" />
            </div>
            <div>
              <h4 className="font-display font-medium text-sm text-white">SailMotion Intelligence Coach</h4>
              <p className="text-[10px] font-mono text-slate-400">Gemini 3.5 Core • Mouad Mouasseif Edition</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-300">SECURE SERVER API</span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
          {messages.map(msg => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {!isUser ? (
                  <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    N
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    A
                  </div>
                )}

                <div className={`p-3.5 rounded-2xl ${
                  isUser 
                    ? "bg-neon-green/15 text-white border border-neon-green/25 font-medium rounded-tr-none" 
                    : "bg-navy-950/80 text-slate-100 border border-white/5 rounded-tl-none leading-relaxed prose prose-invert"
                }`}>
                  {/* Simplistic Markdown Parsing to HTML */}
                  <div className="whitespace-pre-wrap select-text selection:bg-neon-green selection:text-navy-950">
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block mt-1.5 text-right uppercase">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[70%]">
              <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono font-bold text-xs flex items-center justify-center shrink-0 animate-pulse">
                N
              </div>
              <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-white/5 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-neon-green animate-spin" />
                <span className="text-xs text-slate-400 font-mono italic">Calculating sailing physics drag coefficients...</span>
              </div>
            </div>
          )}

          <div ref={endOfChatRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-white/5 bg-navy-950/20 flex gap-2 overflow-x-auto whitespace-nowrap">
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              className="px-2.5 py-1 text-[11px] bg-white/5 hover:bg-[#00FF87]/10 hover:border-[#00FF87]/30 border border-white/5 rounded-full text-slate-300 transition-all cursor-pointer font-medium"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Interactive Text area inputs */}
        <div className="p-3.5 border-t border-white/5 bg-navy-950/70">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }} 
            className="flex gap-2.5"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Coach Mouad about apparent wind angle shifts, roll tacks..."
              className="flex-1 bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-neon-green/50 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-3 bg-neon-green text-navy-950 font-bold hover:bg-neon-green/90 transition-all rounded-xl flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* 2. Custom AI session Report Compiler (Column span 1) */}
      <div className="glass-panel rounded-2xl border border-white/10 p-5 flex flex-col justify-between h-[480px]">
        
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="flex items-center gap-2.5">
            <ClipboardCheck className="w-5 h-5 text-neon-green" />
            <h4 className="font-display font-medium text-base text-white">Elite AI Session Summary</h4>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate a full sailing physics report calibrated against ideal computational fluid dynamics. Contains professional trimming directives.
          </p>

          {activeReport ? (
            <div className="p-3.5 rounded-xl bg-navy-950/60 border border-neon-green/35 text-xs text-slate-200 text-left font-sans leading-relaxed whitespace-pre-wrap select-text h-[260px] overflow-y-auto">
              {activeReport}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-navy-950/40 border border-white/5 flex flex-col items-center justify-center text-center text-slate-500 h-[260px]">
              <HelpCircle className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs">No active comprehensive report has been generated yet.</p>
              <span className="text-[10px] font-mono text-slate-600 uppercase mt-1">Calibrated on Coach Mouad's Olympic metrics</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2">
          {activeReport && (
            <button
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([activeReport], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = `SailMotion_Sailing_Report_${session.athleteName.replace(/\s+/g, "_")}.txt`;
                document.body.appendChild(element);
                element.click();
              }}
              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 rounded-xl border border-white/5 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4 text-neon-green" />
              Export PDF-style txt Report
            </button>
          )}

          <button
            onClick={handleCompileReport}
            disabled={isGeneratingReport}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-navy-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-neon-green/10"
          >
            {isGeneratingReport ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                <span>Synthesizing Telemetries...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-navy-950" />
                <span>Compile AI Performance Report</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
