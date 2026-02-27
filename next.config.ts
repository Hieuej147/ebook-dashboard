import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // Khi bạn gọi /copilotkit ở Frontend
        source: "/api/copilotkit",
        // Nó sẽ tự động "lái" sang cổng 3000 của NestJS
        destination: "http://localhost:3000/copilotkit",
      },
      // {
      //   source: "/api/:path*",
      //   destination: "http://localhost:3000/api/:path*",
      // },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Cho phép tất cả các đường dẫn từ Cloudinary
      },
    ],
  },
};

export default nextConfig;
