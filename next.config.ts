import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  reactCompiler: true,
  // ✅ Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Chống clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Chống MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Chống XSS trên browser cũ
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Chỉ gửi referrer khi cùng origin
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Chỉ cho phép HTTPS (bật khi production)
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
          // Permissions Policy — tắt các API không dùng
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      // ✅ CORS cho API routes
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGIN || "http://localhost:3001",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PATCH,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
