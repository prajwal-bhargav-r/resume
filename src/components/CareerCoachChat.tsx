import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowRight, CornerDownLeft } from "lucide-react";
import { CareerGapReport, ChatMessage } from "../types";
import { sendCareerCoachMessage } from "../services/analysisEngine";

interface CareerCoachChatProps {
  isOpen: boolean;
  onClose: () => void;
  report: CareerGapReport | null;
  initialQuestion?: string;
}

export const CareerCoachChat: React.FC<CareerCoachChatProps> = ({
  isOpen,
  onClose,
  report,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      content: `Hello! I am your ResumeLens Career Coach. I've audited your resume against target requirements for ${report?.targetRole || "your chosen role"} at ${report?.targetCompany || "top tech companies"}. How can I help you accelerate your preparation?`,
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Why is Docker recommended for me?",
    "Which project should I build first?",
    "How should I improve this project?",
    "What should I learn after Python?",
    "Explain my biggest skill gap.",
  ];

  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({ sender: m.sender, content: m.content }));
      const replyText = await sendCareerCoachMessage(query, report, history);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "assistant",
          content: "I'm focusing on your career gap analysis. To maximize your chances, focus on building end-to-end containerized projects with verifiable metrics!",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="career-ai-coach-drawer"
      className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[440px] h-[600px] max-h-[85vh] rounded-3xl glass-panel border border-[#D4AF37]/40 bg-black/95 shadow-2xl shadow-black flex flex-col overflow-hidden backdrop-blur-2xl"
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 bg-gradient-to-r from-black via-[#111] to-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black shadow-md shadow-[#D4AF37]/20">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white font-heading">Career AI Coach</h3>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            </div>
            <p className="text-[11px] text-[#A1A1AA]">
              Grounded in your resume & {report?.targetRole || "target role"}
            </p>
          </div>
        </div>

        <button
          id="close-career-coach-btn"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F5D061] hover:bg-white/10 transition-colors"
          title="Close Coach Drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="p-2.5 bg-black/90 border-b border-[#D4AF37]/20 overflow-x-auto whitespace-nowrap flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-[#F5D061] font-semibold pl-1">Ask:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-black/80 text-[#E4E4E7] hover:bg-[#D4AF37]/20 hover:text-[#F5D061] border border-[#D4AF37]/25 transition-all flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? "bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-black"
                    : "bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D061]"
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-black" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-medium rounded-tr-none shadow-md shadow-[#D4AF37]/20"
                    : "bg-[#111111] text-[#E4E4E7] border border-[#D4AF37]/25 rounded-tl-none whitespace-pre-line"
                }`}
              >
                {msg.content}
                <div
                  className={`text-[9px] font-mono mt-1 ${
                    isUser ? "text-black/70 text-right" : "text-[#71717A]"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#F5D061] font-mono p-2">
            <span className="w-2 h-2 rounded-full bg-[#F5D061] animate-ping" />
            <span>AI Coach analyzing profile...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-[#D4AF37]/20 bg-black flex items-center gap-2"
      >
        <input
          type="text"
          id="career-coach-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about skills, projects, or rewrite advice..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F0F0F] border border-[#D4AF37]/25 text-white placeholder-[#71717A] focus:outline-none focus:border-[#D4AF37] text-xs sm:text-sm"
        />
        <button
          type="submit"
          id="career-coach-send-btn"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-opacity"
          title="Send Question"
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </form>
    </div>
  );
};
