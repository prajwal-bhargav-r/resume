import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Bot, User } from "lucide-react";
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
      content: `Hello! I am your Career AI Coach. I've audited your resume against target requirements for ${report?.targetRole || "your chosen role"} at ${report?.targetCompany || "top tech companies"}. How can I help you accelerate your preparation?`,
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
    } catch {
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
      className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[440px] h-[600px] max-h-[85vh] rounded-3xl bg-white border border-neutral-300 shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white font-heading">Career AI Coach</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-neutral-400">
              Grounded in your resume & {report?.targetRole || "target role"}
            </p>
          </div>
        </div>

        <button
          id="close-career-coach-btn"
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Close Coach Drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="p-2.5 bg-neutral-50 border-b border-neutral-200 overflow-x-auto whitespace-nowrap flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-neutral-500 font-bold pl-1 uppercase tracking-wider">Ask:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white text-neutral-800 hover:text-black hover:border-black border border-neutral-300 transition-all flex-shrink-0 cursor-pointer shadow-2xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAFAFA]">
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
                    ? "bg-black text-white"
                    : "bg-white border border-neutral-300 text-black shadow-2xs"
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-black" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-black text-white font-medium rounded-tr-none shadow-xs"
                    : "bg-white text-neutral-900 border border-neutral-200 rounded-tl-none whitespace-pre-line shadow-2xs"
                }`}
              >
                {msg.content}
                <div
                  className={`text-[9px] font-mono mt-1 ${
                    isUser ? "text-neutral-400 text-right" : "text-neutral-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-neutral-800 font-mono p-2">
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
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
        className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          id="career-coach-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about skills, projects, or rewrite advice..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-xs sm:text-sm"
        />
        <button
          type="submit"
          id="career-coach-send-btn"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-black text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Send Question"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
};
