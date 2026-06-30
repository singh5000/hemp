"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, Bot, User, Leaf, Clock, MapPin, Phone, ChevronRight } from "lucide-react";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

const QUICK_REPLIES = [
  { label: "Store Hours", icon: Clock, answer: "We're open Monday–Saturday 10AM–8PM and Sunday 12PM–4PM. Visit us at 800 N Polk Street, Pineville, NC 28134." },
  { label: "Location", icon: MapPin, answer: "We're located at 800 N Polk Street, Pineville, NC 28134 — just south of Charlotte. Plenty of free parking available!" },
  { label: "Call Us", icon: Phone, answer: "You can reach us at (980) 326-4367. Our friendly staff is happy to help with any questions about our products." },
  { label: "Shipping Info", icon: ChevronRight, answer: "We ship to all 50 states! Orders are processed within 1-2 business days and arrive in 3-7 days via USPS/UPS. Free shipping on orders over $75." },
  { label: "Return Policy", icon: ChevronRight, answer: "We offer hassle-free returns within 30 days. Unopened products in original condition can be returned or exchanged. Contact us for any quality issues — we'll make it right." },
  { label: "Product Help", icon: Leaf, answer: "We carry CBD tinctures, gummies, smokable hemp flower, Delta 8 products, vapes, topicals, pet CBD, and more. All third-party lab tested. What type of product are you looking for?" },
];

const WELCOME = "Hi there! 👋 I'm the Hemp & Barrel assistant. How can I help you today?";

function getTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function findAnswer(text: string): string | null {
  const lower = text.toLowerCase();
  if (/hour|open|close|time/i.test(lower)) return QUICK_REPLIES[0].answer;
  if (/where|location|address|direction|find you/i.test(lower)) return QUICK_REPLIES[1].answer;
  if (/call|phone|number|contact/i.test(lower)) return QUICK_REPLIES[2].answer;
  if (/ship|deliver|free shipping/i.test(lower)) return QUICK_REPLIES[3].answer;
  if (/return|refund|exchange/i.test(lower)) return QUICK_REPLIES[4].answer;
  if (/product|cbd|gumm|tincture|flower|vape|delta|topical|pet/i.test(lower)) return QUICK_REPLIES[5].answer;
  if (/thc|legal|drug test/i.test(lower)) return "All our hemp-derived products contain ≤0.3% Delta-9 THC and are federally legal under the 2018 Farm Bill. Full Spectrum products have trace THC — choose Broad Spectrum or Isolate for zero THC.";
  if (/price|cost|cheap|expensive|discount|coupon|sale/i.test(lower)) return "We offer competitive pricing on all products. Subscribe to our newsletter for exclusive deals! We also have in-store promotions and bundle discounts. Follow us @HempAndBarrel for the latest offers.";
  if (/age|21|old enough/i.test(lower)) return "You must be 21 years or older to purchase from Hemp & Barrel, both online and in-store. Age verification is required at checkout.";
  if (/sleep|insomnia|rest/i.test(lower)) return "For sleep support, we recommend CBD gummies with melatonin, Full Spectrum tinctures taken 30 min before bed, or our CBN products. Our staff can help find the right strength for you!";
  if (/pain|sore|ache|inflammation/i.test(lower)) return "For pain and inflammation, CBD topicals work great for localized relief. Full Spectrum tinctures and high-potency gummies are popular for full-body support. Visit us for personalized recommendations!";
  if (/anxiety|stress|relax|calm/i.test(lower)) return "CBD is widely used for stress and anxiety support. We recommend starting with a mid-potency tincture (500-1000mg) or our calming gummies. Effects are typically felt within 15-45 minutes.";
  if (/hi|hello|hey|sup|what's up/i.test(lower)) return "Hey there! 😊 Welcome to Hemp & Barrel. How can I help you today? You can ask about our products, store hours, shipping, or anything else!";
  if (/thank|thanks|thx/i.test(lower)) return "You're welcome! 😊 Is there anything else I can help with? We're always here for you.";
  if (/bye|goodbye|see ya/i.test(lower)) return "Goodbye! Thanks for chatting with us. Visit us anytime at 800 N Polk St, Pineville, NC. Have a great day! 🌿";
  return null;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: WELCOME, time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    if (promptDismissed || open) return;
    const timer = setTimeout(() => setPromptVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [promptDismissed, open]);

  const addBotReply = (text: string) => {
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), role: "bot", text, time: getTime() }]);
      setTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { id: Date.now(), role: "user", text, time: getTime() }]);
    setInput("");

    const answer = findAnswer(text);
    if (answer) {
      addBotReply(answer);
    } else {
      addBotReply("Thanks for your question! For the best answer, please reach out to our team at (980) 326-4367 or visit us at 800 N Polk St, Pineville, NC. We're happy to help! 🌿");
    }
  };

  const handleQuickReply = (qr: typeof QUICK_REPLIES[0]) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: "user", text: qr.label, time: getTime() },
    ]);
    addBotReply(qr.answer);
  };

  return (
    <>
      {/* Chat bubble + prompt */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3">
        {!open && promptVisible && !promptDismissed && (
          <div className="animate-[fade-in-left_0.4s_ease-out] bg-white rounded-full shadow-lg border border-gray-100 pl-4 pr-2 py-2 flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#3d2b1f] whitespace-nowrap">Need any help?</span>
            <button
              onClick={(e) => { e.stopPropagation(); setPromptDismissed(true); setPromptVisible(false); }}
              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        )}
        <button
          onClick={() => { setOpen(!open); setPromptDismissed(true); setPromptVisible(false); }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 flex-shrink-0 ${
            open
              ? "bg-[#2a1008] rotate-0 scale-100"
              : "bg-[#1A9248] hover:bg-[#148038] hover:scale-110 animate-[bounce-subtle_2s_ease-in-out_infinite]"
          }`}
        >
          {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
          {!open && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Chat window */}
      <div className={`fixed bottom-24 right-6 z-[60] w-[380px] max-w-[calc(100vw-48px)] transition-all duration-500 ${
        open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      }`}>
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden flex flex-col" style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-[#1A9248] px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Image src="/hemp-leaf.png" alt="" width={20} height={20} className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1A9248]" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-[16.5px]">Hemp & Barrel</p>
              <p className="text-white/70 text-[16.5px]">Usually replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f8f6f3]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "bot" ? "bg-[#1A9248]/10" : "bg-[#2a1008]"
                }`}>
                  {msg.role === "bot"
                    ? <Bot className="w-3.5 h-3.5 text-[#1A9248]" />
                    : <User className="w-3.5 h-3.5 text-white" />
                  }
                </div>
                <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-[1.7] ${
                    msg.role === "bot"
                      ? "bg-white text-[#3d2b1f] rounded-tl-md shadow-sm"
                      : "bg-[#1A9248] text-white rounded-tr-md"
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[16.5px] text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : ""}`}>{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1A9248]/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#1A9248]" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-[bounce_1s_ease-in-out_infinite]" />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-[bounce_1s_ease-in-out_0.15s_infinite]" />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-[bounce_1s_ease-in-out_0.3s_infinite]" />
                  </div>
                </div>
              </div>
            )}

            {/* Quick replies — show after welcome */}
            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_REPLIES.map(qr => (
                  <button key={qr.label} onClick={() => handleQuickReply(qr)}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#1A9248] hover:text-[#1A9248] text-[#3d2b1f] text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all shadow-sm">
                    <qr.icon className="w-3 h-3" />
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm text-[#3d2b1f] placeholder:text-gray-300 outline-none bg-gray-50 rounded-full px-4 py-2.5"
              />
              <button type="submit" disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-[#1A9248] hover:bg-[#148038] disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105">
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
            <p className="text-[16.5px] text-gray-300 text-center mt-2">Powered by Hemp & Barrel</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
