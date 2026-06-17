import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, X, Send, Bot, User, Loader2, Heart, DollarSign, Calendar, Headset } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Message = { sender: "ai" | "user"; text: string };

export default function PastorOscarBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "God bless you! I am Pastor Oscar, your AI Church Assistant. I'm here to help with your enquiries about our doctrine, schedules, ministries, and events. How can I assist you today?",
    },
  ]);
  
  const suggestions = [
    "When is the next fasting program?",
    "How do I join the choir?",
    "What time is Sunday service?",
    "Our church doctrine"
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg || isLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);
    setAiError(false);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) throw new Error("Failed to reach the Pastor");

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I'm sorry, I am currently indisposed and unable to answer that right now. If you have a specific question I couldn't address, would you like to speak with a human representative? Use the 'Human Support' button below." },
      ]);
      setAiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTalkToHuman = () => {
    const waNumber = "233243527174";
    const text = encodeURIComponent("Hello Pastor, I have a question that the AI assistant couldn't answer. I'd like to speak with a human representative. 🙏");
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-700 to-cyan-600 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center p-0"
        >
          <MessageSquare className="w-8 h-8 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-2 border-blue-100 animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Pastor Oscar</p>
                <p className="text-[10px] opacity-80 uppercase tracking-wider">Site Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Messages */}
          <CardContent 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === "ai" ? "bg-blue-100 text-blue-700" : "bg-cyan-100 text-cyan-700"
                }`}>
                  {msg.sender === "ai" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-2 rounded-2xl text-sm bg-white text-slate-400 italic flex items-center gap-2">
                  <span>Pastor Oscar is typing</span>
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce ml-0.5" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce ml-0.5" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                </div>
              </div>
            )}
          </CardContent>

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            {/* Suggested Questions */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar -mx-1 px-1">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* Quick Action: Request Prayer */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/prayer-ai");
                }}
                className="flex items-center justify-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-xl h-10 shadow-sm"
              >
                <Heart size={16} className="fill-blue-100" />
                Prayer
              </Button>

              {/* Quick Action: Give Offering */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/give/offering");
                }}
                className="flex items-center justify-center gap-2 border-green-200 text-green-700 hover:bg-green-50 font-bold rounded-xl h-10 shadow-sm"
              >
                <DollarSign size={16} className="fill-green-100" />
                Give
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Quick Action: Register Event */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/register-event");
                }}
                className="flex items-center justify-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 font-bold rounded-xl h-10 shadow-sm"
              >
                <Calendar size={16} className="fill-orange-100" />
                Events
              </Button>

              {/* Quick Action: Talk to Human */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleTalkToHuman}
                className={`flex items-center justify-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl h-10 shadow-sm transition-all duration-300 ${
                  aiError ? 'animate-glow-pulse border-blue-400 text-blue-700 bg-blue-50/50 scale-[1.02]' : ''
                }`}
              >
                <Headset size={16} className="text-blue-500" />
                Human Support
              </Button>
            </div>
            <style>{`
              @keyframes glowing-pulse {
                0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
              }
              .animate-glow-pulse {
                animation: glowing-pulse 2s infinite;
              }
            `}</style>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
                className="rounded-full border-slate-200 focus:ring-blue-500"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-full bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 flex items-center justify-center shrink-0"
              >
                {isLoading ? <Loader2 size={18} className="text-white animate-spin" /> : <Send size={18} className="text-white" />}
              </Button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-2">
              Pastor Oscar is here to help with ministry enquiries.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}