## Deploy, ENV & Security Checklist

File này tổng hợp riêng các vấn đề dễ bị **quên khi deploy** (Vercel + Cloudflare) và các **rủi ro nếu biến môi trường / config bị lộ hoặc set sai**.

---

## 1. Biến môi trường đang dùng

### 1.1. Tổng hợp `process.env` trong dự án

```text
next.config.ts
  - NODE_ENV
  - ALLOWED_ORIGIN

src/app/api/copilotkit/route.ts
  - DEPLOYMENT_URL (dùng làm base URL cho LangGraph server)

src/app/actions/auth.ts
  - NESTJS_API_URL
  - (NESTJS_API_URL_PUBLIC đã comment, không còn dùng)

src/app/actions/book.ts
  - NESTJS_API_URL

src/lib/session.ts
  - SESSION_SECRET_KEY
  - NODE_ENV

src/lib/api-error.ts
  - NODE_ENV

src/lib/axios-server.ts
  - NESTJS_API_URL

src/proxy.ts
  - ARCJET_KEY
  - NESTJS_API_URL
  - NODE_ENV
```

### 1.2. Nhóm biến cần có khi deploy

- **Bắt buộc (production)**
  - `NESTJS_API_URL` – URL backend NestJS (HTTPS).
  - `SESSION_SECRET_KEY` – secret key để mã hóa JWT session (JWE).
  - `ALLOWED_ORIGIN` – domain FE được phép CORS (ví dụ: `https://your-frontend.com`).

- **Khuyến nghị / tùy chọn**
  - `DEPLOYMENT_URL` – base URL cho LangGraph server (Copilot).
  - `ARCJET_KEY` – API key của Arcjet (runtime security).

**Quan trọng:**  
Không có biến nào trong số trên được prefix `NEXT_PUBLIC_`, nên **chúng chỉ tồn tại trên server** → sẽ **không bị lộ trong browser bundle** nếu không vô tình log ra.

---

## 2. Rủi ro chính khi deploy nếu cấu hình sai/thiếu

### 2.1. `NESTJS_API_URL` sai hoặc để `localhost`

- **Triệu chứng**:
  - Tất cả API proxy (`/api/books`, `/api/users`, `/api/orders`, `/api/category`, `/api/chapters`) trả về lỗi 500/502.
  - Dashboard không load được data, toast báo lỗi chung chung.
- **Rủi ro**:
  - FE deploy ok nhưng toàn bộ dữ liệu trống/lỗi → người dùng tưởng app hỏng.
- **Cách tránh**:
  - Set `NESTJS_API_URL` bằng **URL production chính xác của NestJS**:
    - Ví dụ: `https://api.yourdomain.com`.
  - Test trước trên preview deployment (Vercel preview).

### 2.2. `SESSION_SECRET_KEY` yếu hoặc thay đổi sau khi đã có user

- **Triệu chứng nếu secret quá yếu**:
  - Nguy cơ brute force / giải mã token (thực tế cần rất yếu + bug crypto).
- **Triệu chứng nếu đổi secret**:
  - Tất cả user đang login sẽ bị **đăng xuất**, session cookie trở nên invalid.
- **Rủi ro**:
  - Nếu secret bị lộ → attacker có thể forge session.
  - Đổi secret không có kế hoạch → toàn bộ user bị logout đột ngột.
- **Cách tránh**:
  - Dùng secret tối thiểu 32 ký tự, ngẫu nhiên, chỉ set ở server:
    - Có thể dùng `openssl rand -hex 32`.
  - Không chia sẻ secret qua chat/email; chỉ nhập trực tiếp vào Vercel dashboard.

### 2.3. `ALLOWED_ORIGIN` sai

- **Triệu chứng**:
  - Browser báo lỗi CORS khi gọi `/api/*` (đặc biệt khi Frontend chạy trên domain khác).
- **Rủi ro**:
  - FE vẫn build/deploy ok nhưng không gọi được API.
- **Cách tránh**:
  - Trên production, set:
    - `ALLOWED_ORIGIN=https://your-frontend-domain.com`
  - Không để mặc định `http://localhost:3001` trên production.

### 2.4. `ARCJET_KEY` thiếu hoặc để nhầm giá trị

- **Triệu chứng**:
  - Nếu đã integrate Arcjet: request bị lỗi runtime, hoặc Arcjet chạy ở mode error.
- **Rủi ro**:
  - Mất lớp bảo vệ rate limiting / bot protection.
  - Không có log security từ Arcjet.
- **Cách tránh**:
  - Lấy key từ dashboard Arcjet [`https://arcjet.com/`](https://arcjet.com/).
  - Set trong Vercel, không commit lên GitHub.
  - Bắt đầu với mode `DRY_RUN` trong code để test.

### 2.5. `DEPLOYMENT_URL` cho Copilot / LangGraph

- **Triệu chứng**:
  - Copilot sidebar không hoạt động, không trả lời / không chạy tools.
- **Rủi ro**:
  - Tính năng AI không dùng được (nhưng core dashboard vẫn hoạt động).
- **Cách tránh**:
  - Trỏ `DEPLOYMENT_URL` tới đúng LangGraph server (nếu deploy riêng).
  - Hoặc để mặc định local khi dev, và ẩn / disable AI trên production nếu chưa sẵn sàng.

---

## 3. Những thứ có thể vô tình lộ trên browser

### 3.1. Env variables

- **Hiện trạng**:
  - Không có biến `NEXT_PUBLIC_*` nào liên quan đến:
    - `NESTJS_API_URL`
    - `SESSION_SECRET_KEY`
    - `ARCJET_KEY`
    - `ALLOWED_ORIGIN`
  - Các biến này **chỉ dùng trong server code** (Route Handlers, server actions, lib server).
- **Kết luận**:
  - Không có env nhạy cảm nào bị bundle lên client **nếu không log ra**.

### 3.2. Logging nhạy cảm

- **File `src/lib/token.ts`**:
  - Đang có rất nhiều `console.log` log token, payload, expiry:
    - `console.log("token nhận vào:", ...)`
    - `console.log("payload object:", payload);`
  - **Rủi ro**:
    - Token và payload có thể chứa user ID, role, email → lộ trong logs (Vercel, bất kỳ nơi nào đọc logs).
  - **Hành động nên làm trước khi deploy**:
    - Xóa toàn bộ `console.log` trong file này hoặc chỉ log trong `"development"`:
      - An toàn nhất là **remove hết**.

### 3.3. Error logs

- **File `src/lib/api-error.ts`**:
  - Đã có guard:
    - Chỉ log chi tiết khi `NODE_ENV === "development"`.
  - **Tốt**: production sẽ không log chi tiết lỗi ra console.

---

## 4. Checklist cụ thể trước khi push & deploy

### 4.1. Trước khi push lên GitHub

- [ ] Đảm bảo `.env`, `.env.local`, `.env.production` **được ignore** trong `.gitignore`.
- [ ] Không commit bất kỳ file nào chứa secret trực tiếp (không ghi `SESSION_SECRET_KEY` hard-code).
- [ ] Kiểm tra nhanh:
  - [ ] Không còn `console.log` token / sensitive data.
  - [ ] Không có URL backend hard-code vào client components.

### 4.2. Trên Vercel (Environment variables)

Trong tab **Project Settings → Environment Variables**:

- **Production**
  - [ ] `NESTJS_API_URL = https://api.yourdomain.com`
  - [ ] `SESSION_SECRET_KEY = <random-32+ chars>`
  - [ ] `ALLOWED_ORIGIN = https://your-frontend-domain.com`
  - [ ] `ARCJET_KEY = ajkey_xxx` (nếu dùng Arcjet)
  - [ ] `DEPLOYMENT_URL = https://langgraph.yourdomain.com` (nếu có)

- **Preview / Development (tùy chọn)**
  - Có thể để giá trị khác (staging backend).

### 4.3. Sau khi deploy

- [ ] Test:
  - [ ] Sign in / Sign up.
  - [ ] Logout.
  - [ ] Truy cập dashboard (books, categories, orders, users).
  - [ ] Gọi 1–2 action AI (nếu đã bật Copilot).
- [ ] Mở DevTools (Network tab) để:
  - [ ] Đảm bảo request tới `/api/*` không bị lỗi CORS.
  - [ ] Đảm bảo không có response leak stack trace / internal details.

---

## 5. Liên quan Arcjet (runtime security)

Arcjet giúp giảm rủi ro khi cấu hình thiếu:

- **Rate limiting**: chặn spam/DoS ở layer gần runtime.
- **Bot detection**: detect & block bots tự động.
- **Shield**: chặn các pattern XSS, SQLi phổ biến.
- **Email validation**: chặn disposable / invalid emails từ sớm.

Tài liệu:
- [`https://arcjet.com/`](https://arcjet.com/)
- [`https://docs.arcjet.com/quickstart/nextjs`](https://docs.arcjet.com/quickstart/nextjs)

Khi đã integrate Arcjet:
- Đặt mode `DRY_RUN` ban đầu để quan sát, sau đó chuyển sang `LIVE`.
- Theo dõi Arcjet dashboard để xem patterns bất thường.

---

## 6. Tóm tắt nhanh

- Env nhạy cảm **đang ở server-only**, không bị lộ trừ khi log.
- Điểm cần fix trước khi deploy:
  - Xóa `console.log` trong `src/lib/token.ts`.
  - Đảm bảo `.env*` không commit.
  - Set đúng `NESTJS_API_URL`, `SESSION_SECRET_KEY`, `ALLOWED_ORIGIN` trên Vercel.
  - Thêm `ARCJET_KEY` nếu muốn bật Arcjet.
- Sau đó, bạn có thể yên tâm push lên GitHub và deploy lên Vercel + Cloudflare.


