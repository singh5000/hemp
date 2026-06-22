"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  external?: boolean;
}

export default function AnimatedButton({
  href, onClick, children, variant = "primary", size = "md",
  type = "button", disabled = false, className = "", external = false,
}: Props) {
  const sizes = {
    sm: "pl-5 pr-1.5 py-1.5 text-xs gap-2",
    md: "pl-8 pr-2 py-2 text-sm gap-3",
    lg: "pl-10 pr-3 py-3 text-base gap-3",
  };

  const arrowSizes = { sm: "w-7 h-7", md: "w-10 h-10", lg: "w-11 h-11" };

  const variants = {
    primary: "bg-[#1A9248] text-white hover:shadow-[0_0_30px_rgba(26,146,72,0.4)]",
    outline: "bg-transparent border-2 border-[#1A9248] text-[#1A9248] hover:bg-[#1A9248] hover:text-white hover:shadow-[0_0_30px_rgba(26,146,72,0.3)]",
    dark: "bg-[#2a1008] text-white hover:shadow-[0_0_30px_rgba(42,16,8,0.3)]",
  };

  const arrowBg = {
    primary: "bg-white/20 group-hover:bg-white/30",
    outline: "bg-[#1A9248]/10 group-hover:bg-white/20",
    dark: "bg-white/15 group-hover:bg-white/25",
  };

  const cls = `group relative inline-flex items-center ${sizes[size]} rounded-full transition-all duration-500 font-bold uppercase tracking-wider overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`;

  const inner = (
    <>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-[#1A9248] via-[#22b558] to-[#1A9248] bg-[length:200%_100%] group-hover:animate-[shimmer_1.5s_ease-in-out] rounded-full" />
      )}
      <span className="relative z-10">{children}</span>
      <span className={`relative z-10 ${arrowSizes[size]} rounded-full ${arrowBg[variant]} flex items-center justify-center transition-all duration-300 group-hover:rotate-[-30deg] group-hover:scale-110`}>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}
