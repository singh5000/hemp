import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-24">
      <div className="relative w-16 h-16 mb-5">
        <div className="absolute inset-0 rounded-full border-4 border-[#1A9248]/15" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1A9248] animate-spin" />
        <Image src="/hemp-leaf.png" alt="" width={24} height={24}
          className="absolute inset-0 m-auto opacity-70" />
      </div>
      <p className="text-[#3d2b1f]/50 text-[13px] font-bold uppercase tracking-[0.25em]">Loading</p>
    </div>
  );
}
