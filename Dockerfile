# Sử dụng node 24 alpine để tối ưu dung lượng và hiệu năng
FROM node:24-alpine AS base

# ==========================================
# Bước 1: Cài đặt dependencies (deps)
# ==========================================
FROM base AS deps
# Thêm libc6-compat vì một số thư viện node cần nó để chạy trên alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy các file quản lý package
COPY package.json package-lock.json* ./
# Cài đặt dependencies (sử dụng npm ci để đảm bảo tính nhất quán)
RUN npm ci

# ==========================================
# Bước 2: Build mã nguồn (builder)
# ==========================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tắt tính năng thu thập dữ liệu ẩn danh của Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Tiến hành build production
RUN npm run build

# ==========================================
# Bước 3: Môi trường chạy Production (runner)
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Tạo user không phải root để bảo mật
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy thư mục public nếu có
COPY --from=builder /app/public ./public

# Tận dụng tính năng standalone của Next.js để image nhẹ nhất
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Chạy server bằng node
CMD ["node", "server.js"]