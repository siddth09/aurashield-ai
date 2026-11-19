import React, { useState, useRef, useEffect } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { askAuraCopilot, hasActiveApiKey } from '../services/geminiService';
import { ChatMessage } from '../types';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  RotateCcw,
  Zap
} from 'lucide-react';

export const AuraCopilot: React.FC = () => {
  const { aqiData, profile } = useHousehold();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 **Hello! I am Aura Copilot**, your GenAI Urban Smog & Air Quality Assistant.

Current conditions in **${aqiData.location}**: **${aqiData.aqi} AQI (${aqiData.category})**.
* **Atmospheric Inversion:** ${aqiData.inversionRisk} level
* **Safe Window:** ${aqiData.ventilationWindow.startHour}:00 - ${aqiData.ventilationWindow.endHour}:00 PM

How can I help you protect your family and optimize your routine today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '🚨 Toddler cough & high AQI', payload: 'My toddler has a mild cough and the outdoor AQI is high. What emergency triage steps should I take?' },
        { label: '🪟 Safe window ventilation timing', payload: 'When is it safe to open windows today without letting in morning smog?' },
        { label: '🛠️ Corsi-Rosenthal DIY box blueprint', payload: 'How do I build and size a Corsi-Rosenthal DIY air purifier box for my room?' },
        { label: '🚴 Low-emission commute advice', payload: 'How should I modify my daily commute today to minimize particulate exposure?' }
      ]
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isKeyActive = hasActiveApiKey();

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await askAuraCopilot(textToSend, aqiData, profile, history);

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
        isEmergencyAlert: res.isEmergencyAlert,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: 'I encountered an error processing your query. Please try again or check your network.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Chat reset. Ask me anything about winter smog, DIY air filters, ventilation windows, or commute alternatives for **${aqiData.location}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '🪟 When to open windows today?', payload: 'When is the best time to ventilate today?' },
          { label: '🛠️ Build DIY Air Purifier', payload: 'How to build a Corsi-Rosenthal filter?' }
        ]
      }
    ]);
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Aura Copilot</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                isKeyActive
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-700'
              }`}>
                <Zap className="w-2.5 h-2.5" />
                {isKeyActive ? 'Gemini 2.5 Live' : 'Smart Heuristic Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Context-Aware Smog Copilot & Household Health Advisor
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all"
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-emerald-400 border border-slate-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Emergency banner if present */}
                {msg.isEmergencyAlert && (
                  <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-600/70 text-rose-200 text-xs flex items-center gap-2 mb-1">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="font-semibold">Priority Health Advisory Triggered</span>
                  </div>
                )}

                {/* Message Body */}
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-700/70 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>

                <div className={`text-[10px] text-slate-400 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action.payload)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border border-slate-700/70 text-[11px] transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aura Copilot is analyzing atmospheric & medical telemetry...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-3 border-t border-slate-700/60 shrink-0 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Aura Copilot about DIY air filters, ventilation, symptoms, or commute..."
          className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
