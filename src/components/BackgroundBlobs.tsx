// components/BackgroundBlobs.tsx
export const BackgroundBlobs = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#F8F9FD]">
    {/* Khối màu tím điện tử */}
    <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-[120px] animate-pulse" />
    {/* Khối màu hồng lavender */}
    <div className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-pink-300/15 blur-[100px] animate-bounce-slow" />
    {/* Khối vàng nhạt tạo độ sâu */}
    <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] rounded-full bg-yellow-200/10 blur-[80px]" />
  </div>
);
