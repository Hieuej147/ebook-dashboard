"use client";
import { BookCheckIcon, BookOpen, ChevronDown, ChevronUp, Earth, Ruler, Settings } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

interface BookData {
  title: string;
  author: string;
  imageUrl?: string;
  category: string;
  description: string;
}

const BookDetail = ({ data }: { data: BookData }) => {
  // --- STATES QUẢN LÝ "VIEW MORE" ---
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái: Đang mở hay đóng
  const [isOverflowing, setIsOverflowing] = useState(false); // Trạng thái: Có cần nút View More không

  // Ref để truy cập trực tiếp vào thẻ <p> mô tả trong DOM thật
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // --- ĐO CHIỀU CAO ĐỂ QUYẾT ĐỊNH HIỂN THỊ NÚT ---
  // Sử dụng useLayoutEffect để đo đạc ngay sau khi render nhưng trước khi trình duyệt vẽ lên màn hình
  // để tránh hiện tượng giật layout (flicker).
  useLayoutEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;

    // scrollHeight: Chiều cao thực tế của nội dung (nếu không bị cắt)
    // clientHeight: Chiều cao đang hiển thị trên màn hình (đang bị cắt bởi line-clamp)
    // Nếu scrollHeight lớn hơn clientHeight nghĩa là nội dung đang bị tràn.
    if (element.scrollHeight > element.clientHeight) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [data.description]); // Chạy lại nếu nội dung mô tả thay đổi

  const toggleExpand = () => setIsExpanded(!isExpanded);
  return (
    <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
      {/** * CỘT TRÁI: Thu nhỏ lại (3/12 cột trên màn hình lớn)
       * Giúp ảnh không bị phóng quá to gây mất cân đối
       */}
      <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
        <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
          <img
            src={data.imageUrl || "/harry.jpg"} // Dùng ảnh từ API
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Nút Action sử dụng màu cam #f28c28 như yêu cầu */}
        <button className="w-full bg-[#f28c28] hover:bg-[#e07b1d] text-white p-4 rounded-xl flex items-center justify-center shadow-lg group transition-all">
          <div className="flex items-center gap-2">
            <Settings
              size={20}
              className="group-hover:rotate-90 transition-transform duration-500"
            />
            <span className="font-bold text-lg">Edit Book</span>
          </div>
        </button>
      </div>

      {/** * CỘT PHẢI: Chiếm 9/12 cột để nội dung rộng rãi
       */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-8">
        {/* Header: Tiêu đề & Tác giả */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#eef8ff] text-[#3182ce] px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
              Trending #1
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            {data.title}
          </h1>
          <p className="text-slate-400 font-medium italic text-lg">
            #1 New York Times Bestseller!
          </p>
          <div className="flex items-center gap-3 mt-6">
            <img
              src="https://github.com/shadcn.png"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              alt="avatar"
            />
            <span className="font-bold text-slate-700 text-lg underline decoration-slate-200 underline-offset-8">
              By {data.author}
            </span>
          </div>
        </div>

        {/* Thông số & Mô tả: Sử dụng border-y để phân cách sạch sẽ */}
        <div className="grid grid-cols-2 md:grid-cols-4  gap-y-8 py-10 border-y border-slate-100">
          <InfoItem label="Language" value="English" />
          <InfoItem label="Genre" value={data.category} />
          <InfoItem label="Format" value="eBook" />
          <InfoItem label="Length" value="64 Pages" />

          {/* Phần Comment/Description trải dài hết 4 cột */}
          <div className="col-span-2 md:col-span-4 space-y-6 mt-4">
            <div className="relative">
              <p
                ref={descriptionRef}
                // LOGIC CSS: Nếu đang mở (isExpanded) thì không clamp, ngược lại thì clamp 3 dòng
                className={`text-slate-500 text-lg leading-relaxed italic pr-10 transition-all duration-300 ${
                  isExpanded ? "" : "line-clamp-3"
                }`}
              >
                "{data.description || "No description available."}"
              </p>
              {/* Hiệu ứng mờ dần khi chưa mở rộng */}
              {!isExpanded && isOverflowing && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent pointer-events-none" />
              )}
              {/* CHỈ HIỂN THỊ NÚT NẾU NỘI DUNG BỊ TRÀN (isOverflowing = true) */}
              {isOverflowing && (
                <button
                  onClick={toggleExpand}
                  className="flex items-center gap-1 text-slate-900 font-black text-xs underline underline-offset-8 decoration-slate-300 uppercase tracking-[0.2em] hover:text-[#f28c28] hover:decoration-[#f28c28]/50 transition-all mt-2"
                >
                  {isExpanded ? (
                    <>
                      View Less <ChevronUp size={14} className="mt-0.5" />
                    </>
                  ) : (
                    <>
                      View More <ChevronDown size={14} className="mt-0.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const InfoItem = ({ label, value }: { label: string; value: string }) => {
  const iconMap: Record<string, any> = {
    Language: Earth,
    Genre: BookOpen,
    Format: BookCheckIcon,
    Length: Ruler,
  };
  const Icon = iconMap[label];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-slate-400">
        {Icon && <Icon size={16} className="stroke-[2.5px]" />}
        <span className="text-[10px] uppercase font-black tracking-[0.15em]">
          {label}
        </span>
      </div>
      <span className="font-black text-base text-slate-800 block">{value}</span>
    </div>
  );
};
export default BookDetail;
