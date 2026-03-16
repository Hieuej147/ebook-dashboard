## BookStudio Dashboard

Admin dashboard cho nền tảng ebook, xây bằng **Next.js App Router**, tích hợp **AI Copilot**, quản lý **sách, danh mục, đơn hàng, người dùng**.

### Tech stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons
- **State / Forms**: React Hook Form, Zod
- **Charts / UI nâng cao**: Recharts, dnd-kit, embla-carousel
- **Auth & Backend**:
  - FE: Next.js + `jose` + httpOnly session cookie
  - BE: NestJS (REST API, JWT) – kết nối qua `axiosServer`
- **AI / Copilot**: CopilotKit + LangGraph agent (proxy qua `/api/copilotkit`)
- **Security runtime (dự kiến)**: Arcjet – AI runtime security [`https://arcjet.com/`](https://arcjet.com/)

---

## 1. Project structure

```text
src/
  app/
    (auth)/
      signin/
      signup/
    (admin)/
      layout.tsx          # Admin shell (sidebar, navbar, AI panel)
      dashboard/
        page.tsx          # Tổng quan dashboard
        books/
        categories/
        orders/
        users/
    actions/              # Server actions (auth, books)
    api/                  # Next.js Route Handlers (proxy -> NestJS, Copilot)
    layout.tsx            # Root layout (theme, CopilotKit provider)
    page.tsx              # Landing page (marketing)

  components/
    layout/               # Navbar, AppSidebar, DashboardLayout
    books/                # Books dashboard, dialog, detail, promo…
    categories/           # Category dashboard, folder, dialog…
    orders/               # Orders dashboard, order cards, user orders…
    users/                # User table, user info, actions, edit…
    dashboard/            # Quick stats, recent activity, todo, chart…
    action-ai/            # Hooks cho CopilotKit (tools, stats, todo…)
    ui/                   # shadcn primitives: button, input, table, dialog…

  lib/
    axios-server.ts       # Axios instance dùng session cookie -> NestJS
    api-error.ts          # Chuẩn hóa lỗi từ NestJS
    dal.ts                # Data access helpers (books, orders, categories)
    session.ts            # JWT session + cookies
    token.ts              # Decode JWT expiry
    zod.ts                # Zod schemas (auth, books, categories, chapters, users)
    types.ts              # Domain types

  hooks/
    use-mobile.ts         # Responsive helpers
    useChapterStreaming.ts# Stream chương từ AI/BE
```

Chi tiết review cấu trúc & chất lượng code nằm trong `PROJECT_STRUCTURE_REVIEW.md`.

---

## 2. Environment variables

Tạo file `.env.local` (không commit lên GitHub) với các biến sau:

```bash
# NestJS backend
NESTJS_API_URL=https://your-nest-api.com

# Session / JWT
SESSION_SECRET_KEY=super-strong-random-secret-min-32-chars

# Security / CORS
ALLOWED_ORIGIN=https://your-frontend-domain.com

# Arcjet (runtime security)
ARCJET_KEY=ajkey_xxx  # Lấy từ dashboard Arcjet: https://arcjet.com/
```

**Lưu ý bảo mật:**
- Không prefix các biến nhạy cảm bằng `NEXT_PUBLIC_` (để chúng chỉ tồn tại trên server).
- Không commit `.env*` lên GitHub (hãy đảm bảo `.gitignore` đã ignore).

---

## 3. Chạy ứng dụng local

### 3.1. Cài đặt dependencies

```bash
pnpm install
# hoặc
npm install
```

### 3.2. Chạy dev server

```bash
pnpm dev
# hoặc
npm run dev
```

Mặc định app chạy tại `http://localhost:3000`.

---

## 4. Build & deploy

### 4.1. Build production

```bash
pnpm build
pnpm start
```

### 4.2. Deploy lên Vercel

1. Push project lên GitHub (đảm bảo **không commit `.env.local`**).
2. Trên Vercel:
   - Import repo từ GitHub.
   - Set environment variables trong tab **Environment Variables**:
     - `NESTJS_API_URL`
     - `SESSION_SECRET_KEY`
     - `ALLOWED_ORIGIN`
     - `ARCJET_KEY` (nếu dùng Arcjet)
3. Deploy.

### 4.3. Cloudflare phía trước (tùy chọn)

Bạn có thể đặt Cloudflare trước Vercel để:
- Cache static assets mạnh hơn.
- Bật thêm WAF, bot protection.

Đảm bảo:
- Cloudflare không phá vỡ **cookies / headers** quan trọng (đặc biệt là `Set-Cookie`, `Authorization`).

---

## 5. Security & runtime notes

- **Auth & session**
  - FE sử dụng httpOnly cookie `session` chứa JWT mã hóa (JWE) với `SESSION_SECRET_KEY`.
  - `axiosServer` tự động đọc session từ cookie và attach `Authorization: Bearer <token>` khi gọi NestJS.
  - NestJS chịu trách nhiệm validate token + role (ADMIN/USER).

- **Next.js API routes (`src/app/api`)**
  - Đa số chỉ đóng vai trò **proxy**:
    - Check session (`getSession()`).
    - Validate input bằng Zod (books, categories, chapters, users).
    - Gọi NestJS bằng `axiosServer`.
  - Không có logic nhạy cảm chạy trên client, chỉ trên server.

- **Arcjet** (dự định dùng)
  - Thêm rate limiting, bot detection, shield protection ở runtime.
  - Xem docs: [`https://arcjet.com/`](https://arcjet.com/) và [`https://docs.arcjet.com/quickstart/nextjs`](https://docs.arcjet.com/quickstart/nextjs).

Chi tiết rủi ro & checklist deploy nằm trong file `PROJECT_ANALYSIS_2.md`.

---

## 6. Scripts hữu ích

```bash
pnpm dev       # Chạy dev server
pnpm build     # Build production
pnpm start     # Chạy production build
pnpm lint      # Chạy ESLint
```

---

## 7. Những việc nên double-check trước khi deploy

- [ ] `.env.local` đầy đủ, **không commit lên GitHub**.
- [ ] `SESSION_SECRET_KEY` đủ dài/ngẫu nhiên (ít nhất 32 ký tự).
- [ ] `NESTJS_API_URL` trỏ tới backend production (không còn `localhost`).
- [ ] `ALLOWED_ORIGIN` trỏ tới domain thật (không để mặc định `http://localhost:3001`).
- [ ] Đã bật `NODE_ENV=production` khi build (Vercel tự set).
- [ ] Không còn `console.log` nhạy cảm trong `src/lib/token.ts` (log token).
- [ ] Đã test signin/signup, dashboard, AI actions trên môi trường staging/preview.

---

## 8. Tài liệu thêm

- `PROJECT_STRUCTURE_REVIEW.md` – review cấu trúc + performance + refactor đề xuất.
- `PROJECT_ANALYSIS_2.md` – phân tích bảo mật & deployment chi tiết.

