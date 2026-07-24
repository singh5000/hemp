"use client";
import { useState } from "react";
import { Star, Send, CheckCircle, MessageSquarePlus } from "lucide-react";

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

export default function WriteReview({ productId, productName }: { productId: number; productName: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setErrMsg("Please select a star rating."); return; }
    if (!name || !email || !review) { setErrMsg("All fields are required."); return; }

    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch(`/api/hemp/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, name, email, review }),
      });
      const data = await res.json() as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Failed to submit review.");
      setStatus("sent");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-[#1A9248]/5 border border-[#1A9248]/20 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-[#1A9248] mx-auto mb-3" />
        <p className="text-[#2a1008] font-bold text-[16.5px] mb-1">Thank You!</p>
        <p className="text-gray-500 text-[16.5px]">Your review has been submitted and is pending approval.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="group flex items-center gap-2.5 bg-[#1A9248] hover:bg-[#148038] text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1A9248]/20">
        <MessageSquarePlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Write a Review
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[#2a1008] font-bold text-[26px]">Write a Review</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium">Cancel</button>
      </div>

      <p className="text-[16.5px] text-gray-400 mb-4">Reviewing: <span className="text-[#2a1008] font-semibold">{productName}</span></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <p className="text-[16.5px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-2">Your Rating *</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
                className="p-0.5 transition-transform hover:scale-110">
                <Star className={`w-7 h-7 transition-colors ${
                  i <= (hover || rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"
                }`} />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs text-gray-400 self-center">
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1 block">Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-300" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1 block">Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-300" />
          </div>
        </div>

        {/* Review text */}
        <div>
          <label className="text-[10px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1 block">Your Review *</label>
          <textarea value={review} onChange={e => setReview(e.target.value)} required rows={4}
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-300 resize-none" />
        </div>

        {/* Error */}
        {errMsg && (
          <p className="text-red-500 text-[16.5px] bg-red-50 px-3 py-2 rounded-lg">{errMsg}</p>
        )}

        {/* Submit */}
        <button type="submit" disabled={status === "sending"}
          className="flex items-center gap-2 bg-[#1A9248] hover:bg-[#148038] disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-xl transition-all">
          {status === "sending" ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
          ) : (
            <><Send className="w-4 h-4" /> Submit Review</>
          )}
        </button>
      </form>
    </div>
  );
}
