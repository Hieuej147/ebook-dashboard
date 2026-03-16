// components/admin/PromoBanner.tsx
export default function PromoBanner() {
  return (
    <div className="bg-[#f0f9ff] rounded-2xl p-6 border border-[#e0f2fe] relative overflow-hidden h-[160px] flex items-center">
      {/* Nội dung chữ */}
      <div className="space-y-3 z-10 w-2/3">
        <h3 className="font-bold text-slate-900 text-base">Follow & Save 15%!</h3>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Get 15% off your favorite author's latest ebook—today only!
        </p>
        <button className="bg-white text-slate-900 font-bold text-[10px] px-6 py-2 rounded-lg shadow-sm border border-slate-100 uppercase tracking-widest hover:bg-slate-50 transition-all">
          Follow
        </button>
      </div>

      {/* Ảnh Avatar tác giả với hiệu ứng Grayscale nhạt */}
      <div className="absolute right-[-10px] bottom-0 w-32 h-32 opacity-90 pointer-events-none">
        <img 
          src="https://github.com/shadcn.png" // Thay bằng ảnh Abby Jimenez nếu có
          className="w-full h-full object-cover rounded-full mix-blend-multiply" 
          alt="Author" 
        />
        {/* Vòng tròn trang trí phía sau */}
        <div className="absolute inset-0 border border-blue-200 rounded-full scale-125 -z-10" />
        <div className="absolute inset-0 border border-blue-100 rounded-full scale-150 -z-10" />
      </div>
    </div>
  );
}