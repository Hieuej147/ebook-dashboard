# Phân Tích Dự Án - Project Analysis Report

**Ngày tạo:** 2024  
**Dự án:** BookStudio Dashboard  
**Framework:** Next.js 16.1.4

---

## 📋 Mục Lục

1. [Components Không Được Sử Dụng](#components-không-được-sử-dụng)
2. [API Routes Không Được Sử Dụng](#api-routes-không-được-sử-dụng)
3. [Lỗi Bảo Mật Khi Deploy](#lỗi-bảo-mật-khi-deploy)
4. [Các Vấn Đề Cần Cải Thiện](#các-vấn-đề-cần-cải-thiện)
5. [Routes Có Thể Lộ Trên Browser](#routes-có-thể-lộ-trên-browser)

---

## 🗑️ Components Không Được Sử Dụng
## Done da xoa
### 1. **BackgroundBlobs.tsx**
- **Đường dẫn:** `src/components/BackgroundBlobs.tsx`
- **Mô tả:** Component tạo hiệu ứng background với các blob màu
- **Trạng thái:** ❌ Không được import hoặc sử dụng ở bất kỳ đâu
- **Khuyến nghị:** Xóa file hoặc tích hợp vào trang landing nếu cần

### 2. **CardCalender.tsx**
- **Đường dẫn:** `src/components/CardCalender.tsx`
- **Mô tả:** Component hiển thị calendar
- **Trạng thái:** ❌ Không được import hoặc sử dụng
- **Khuyến nghị:** Xóa file hoặc tích hợp vào dashboard nếu cần tính năng calendar

### 3. **NavItem.tsx**
- **Đường dẫn:** `src/components/NavItem.tsx`
- **Mô tả:** Component navigation item với active state
- **Trạng thái:** ❌ Không được sử dụng (AppSidebar sử dụng component khác)
- **Khuyến nghị:** Xóa file nếu không có kế hoạch sử dụng

### 4. **StatusTag.tsx**
- **Đường dẫn:** `src/components/StatusTag.tsx`
- **Mô tả:** Component hiển thị tag status (DRAFT/PUBLISHED)
- **Trạng thái:** ❌ Không được import hoặc sử dụng
- **Khuyến nghị:** Xóa file hoặc thay thế bằng Badge component từ shadcn/ui

### 5. **Progress.tsx**
- **Đường dẫn:** `src/components/Progress.tsx`
- **Mô tả:** Component hiển thị progress logs
- **Trạng thái:** ❌ Không được sử dụng (có `action-ai/Log.tsx` với component Progress khác)
- **Lưu ý:** Có component Progress khác trong `src/components/action-ai/Log.tsx` đang được sử dụng
- **Khuyến nghị:** Xóa file này để tránh nhầm lẫn, hoặc đổi tên nếu cần dùng cho mục đích khác

### 6. **BookActions.tsx**
- **Đường dẫn:** `src/components/BookActions.tsx`
- **Mô tả:** Component dropdown menu với actions (Edit, Delete) cho book
- **Trạng thái:** ⚠️ Có code nhưng không thấy được import ở đâu
- **Khuyến nghị:** Kiểm tra lại xem có được sử dụng trong RowBook hoặc BookDetail không, nếu không thì xóa

---

## 🚫 API Routes Không Được Sử Dụng
## Done Da Xoa
### 1. **/api/orders/route.ts**
- **Đường dẫn:** `src/app/api/orders/route.ts`
- **Mô tả:** Route handler GET cho `/api/orders` (không phải `/api/orders/admin/all`)
- **Trạng thái:** ❌ Không được sử dụng
- **Lý do:** 
  - Codebase sử dụng `/api/orders/admin/all` thay vì `/api/orders`
  - File này có comment `// app/api/orders/all/route.ts` nhưng không khớp với đường dẫn thực tế
- **Khuyến nghị:** 
  - Xóa file này nếu không cần
  - Hoặc đổi tên thành `/api/orders/all/route.ts` nếu muốn giữ endpoint `/api/orders/all`

### 2. **/api/auth/update/route.ts**
- **Đường dẫn:** `src/app/api/auth/update/route.ts`
- **Mô tả:** Route handler để update tokens (accessToken, refreshToken)
- **Trạng thái:** ❌ Đã bị comment out hoàn toàn
- **Lý do:** 
  - Toàn bộ code trong file đã bị comment
  - Nhưng vẫn được gọi trong `src/app/actions/auth.ts` (dòng 131): `fetch(\`${process.env.NESTJS_API_URL_PUBLIC}/api/auth/update\`)`
- **Vấn đề:** 
  - Route handler không hoạt động nhưng vẫn được gọi từ code
  - Có thể gây lỗi khi refresh token
- **Khuyến nghị:** 
  - Uncomment và implement lại route handler
  - Hoặc xóa code gọi route này trong `auth.ts` và xử lý update token trực tiếp

---

## 🔒 Lỗi Bảo Mật Khi Deploy

> **Lưu ý quan trọng:** NestJS backend đã implement authentication và role-based authorization. Next.js API routes chỉ đóng vai trò proxy, forward requests đến NestJS với Bearer token. NestJS sẽ validate token và check role permissions.

### ✅ ĐÃ ĐƯỢC IMPLEMENT

#### 1. **Authentication Check trong API Routes** ✅
- **Trạng thái:** ✅ ĐÃ IMPLEMENT
- **Chi tiết:** Tất cả API routes đã có authentication check:
  - `/api/books/route.ts` - ✅ Có `getSession()` check
  - `/api/books/[id]/route.ts` - ✅ Có `getSession()` check
  - `/api/books/admin/all/route.ts` - ✅ Có `getSession()` check
  - `/api/category/route.ts` - ✅ Có `getSession()` check
  - `/api/category/list/route.ts` - ✅ Có `getSession()` check
  - `/api/chapters/route.ts` - ✅ Có `getSession()` check
  - `/api/chapters/[id]/route.ts` - ✅ Có `getSession()` check
  - `/api/orders/admin/all/route.ts` - ✅ Có `getSession()` check
  - `/api/orders/user/[userId]/route.ts` - ✅ Có `getSession()` check
  - `/api/users/[id]/route.ts` - ✅ Có `getSession()` check
- **Cơ chế:** 
  - `axios-server.ts` tự động attach Bearer token từ session cookie
  - NestJS backend sẽ validate token và check role permissions
  - Nếu token invalid hoặc không có quyền, NestJS sẽ trả về 401/403

#### 2. **Authorization Check (Role-Based Access)** ✅
- **Trạng thái:** ✅ ĐƯỢC XỬ LÝ BỞI NESTJS BACKEND
- **Chi tiết:** 
  - Next.js routes chỉ forward request với token
  - NestJS backend có guards để check role (ADMIN/USER)
  - Admin routes như `/books/admin/all`, `/orders/admin/all` được protect ở NestJS
- **Không cần implement ở Next.js:** Vì NestJS đã handle toàn bộ authorization logic

#### 3. **Input Validation** ✅
- **Trạng thái:** ✅ ĐÃ IMPLEMENT VỚI ZOD
- **Chi tiết:** Tất cả POST/PATCH routes đã có validation:
  - `/api/books/route.ts` - ✅ Sử dụng `createBookApiSchema` (DialogBook)
  - `/api/category/route.ts` - ✅ Sử dụng `createCategoryApiSchema` (DialogCategory)
  - `/api/chapters/route.ts` - ✅ Sử dụng `createChaptersApiSchema` (EditPage)
  - `/api/users/[id]/route.ts` - ✅ Sử dụng `updateUserApiSchema` (UserDetailPage)
- **Schemas:** Được define trong `src/lib/zod.ts`
- **Lưu ý:** 
  - `/api/books/[id]/route.ts` PATCH không có validation vì nhận FormData (file upload)
  - `/api/chapters/[id]/route.ts` PATCH không có validation - **CẦN THÊM**

### 🔴 CRITICAL - Các Vấn Đề Cần Fix Trước Khi Deploy

#### 4. **Environment Variables Có Thể Bị Expose**
- **Vấn đề:** 
  - `process.env.NESTJS_API_URL` được sử dụng trong client-side code (nếu có)
  - Không có validation cho env variables
- **Rủi ro:** API URL có thể bị lộ trong bundle JavaScript
- **Giải pháp:**
  - Chỉ sử dụng env variables trong server-side code
  - Sử dụng `NEXT_PUBLIC_` prefix chỉ cho variables cần expose
  - Validate env variables khi app khởi động

#### 5. **Session Security Issues**
- **Vấn đề:**
  - Session cookie có `secure: true` nhưng có thể không hoạt động đúng trong development
  - Không có `httpOnly` check trong một số trường hợp
  - Session secret key có thể không đủ mạnh
- **File:** `src/lib/session.ts`
- **Rủi ro:** Session hijacking, XSS attacks
- **Giải pháp:**
  ```typescript
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Chỉ secure trong production
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  ```

#### 1. **Console.log Lộ Thông Tin Nhạy Cảm** 🔴
- **Vấn đề:** 
  - `src/lib/token.ts` có nhiều console.log với token data (dòng 4-19)
  - Log cả token payload và expiry time
- **Rủi ro:** 
  - Token có thể bị lộ trong server logs
  - Thông tin user (user ID, email) có thể bị lộ trong token payload
- **Giải pháp:**
  ```typescript
  // src/lib/token.ts
  export function decodeJwtExpiry(token: string): number | null {
    try {
      // ❌ XÓA TẤT CẢ console.log
      // if (process.env.NODE_ENV === "development") {
      //   console.log("=== decodeJwtExpiry ===");
      // }
      const base64Payload = token.split(".")[1];
      const decoded = Buffer.from(base64Payload, "base64url").toString("utf8");
      const payload = JSON.parse(decoded);
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }
  ```
- **Trạng thái:** ⚠️ CẦN FIX NGAY

#### 2. **Thiếu Validation cho PATCH Chapters** 🔴
- **Vấn đề:** 
  - `/api/chapters/[id]/route.ts` PATCH không có input validation
- **Rủi ro:** 
  - Invalid data có thể được gửi đến NestJS
  - Có thể gây lỗi hoặc security issues
- **Giải pháp:** Thêm Zod schema validation:
  ```typescript
  // src/lib/zod.ts - Thêm schema mới
  export const updateChapterApiSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional().nullable(),
    content: z.string().optional(),
    chapterNumber: z.number().int().positive().optional(),
  });
  
  // src/app/api/chapters/[id]/route.ts
  const result = updateChapterApiSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  ```

### 🟡 MEDIUM - Các Vấn Đề Trung Bình

#### 3. **Thiếu Rate Limiting** 🟡
- **Vấn đề:** Không có rate limiting cho API endpoints
- **Rủi ro:** 
  - DDoS attacks
  - Brute force attacks trên login endpoint
- **Giải pháp:** 
  - Sử dụng middleware rate limiting (next-rate-limit, upstash/ratelimit)
  - Implement rate limiting cho `/api/auth/*` endpoints

#### 4. **Thiếu CORS Protection** 🟡
- **Vấn đề:** Không có CORS configuration
- **Rủi ro:** Có thể bị gọi từ domain khác
- **Giải pháp:** 
  ```typescript
  // next.config.ts
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://yourdomain.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,PATCH" },
        ],
      },
    ];
  }
  ```

#### 5. **Thiếu CSRF Protection** 🟡
- **Vấn đề:** Không có CSRF token cho POST/PATCH/DELETE requests
- **Rủi ro:** CSRF attacks
- **Giải pháp:** 
  - Sử dụng Next.js built-in CSRF protection
  - Hoặc implement CSRF token manually

#### 6. **Error Messages** ✅
- **Trạng thái:** ✅ ĐÃ ĐƯỢC XỬ LÝ ĐÚNG
- **File:** `src/lib/api-error.ts`
- **Chi tiết:** 
  - Đã có check `process.env.NODE_ENV === "development"` cho console.log
  - Chỉ trả về generic message cho client
  - Không expose stack trace hoặc internal details
- **Không cần fix:** Code đã đúng

#### 7. **Thiếu Security Headers** 🟡
- **Vấn đề:** Không có security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- **Rủi ro:** Clickjacking, MIME type sniffing attacks
- **Giải pháp:**
  ```typescript
  // next.config.ts
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  }
  ```

### 🟢 LOW - Các Vấn Đề Nhỏ

#### 8. **Hardcoded Values** 🟢
- **Vấn đề:** 
  - `next.config.ts` có hardcoded URL `http://localhost:3000`
  - Một số magic numbers trong code
- **Giải pháp:** Sử dụng environment variables

#### 9. **Thiếu Request Size Limit** 🟢
- **Vấn đề:** Không giới hạn kích thước request body
- **Rủi ro:** Memory exhaustion attacks
- **Giải pháp:** 
  ```typescript
  // next.config.ts
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  }
  ```

---

## 🔧 Các Vấn Đề Cần Cải Thiện

### 1. **Code Quality**

#### 1.1. TypeScript Types
- **Vấn đề:** 
  - Nhiều `any` types trong code
  - Thiếu type definitions cho API responses
  - Component props không có proper types
- **Files cần cải thiện:**
  - `src/components/BooksDashboardClient.tsx` - props: `any`
  - `src/components/OrdersDashboardClient.tsx` - props: `any`
  - `src/components/BookActions.tsx` - `book: any`
  - `src/components/OrderDetailDialog.tsx` - `order: any`
- **Giải pháp:** Tạo proper TypeScript interfaces cho tất cả data structures

#### 1.2. Error Handling
- **Vấn đề:** 
  - Một số nơi không có try-catch
  - Error handling không consistent
- **Giải pháp:** 
  - Sử dụng error boundary cho React components
  - Consistent error handling pattern

#### 1.3. Code Duplication
- **Vấn đề:** 
  - Logic fetch data bị lặp lại ở nhiều nơi
  - Similar components có thể được abstract
- **Giải pháp:** 
  - Tạo custom hooks cho data fetching
  - Tạo reusable components

### 2. **Performance**

#### 2.1. Image Optimization
- **Vấn đề:** 
  - Sử dụng `<img>` tag thay vì Next.js `<Image>` component
  - Không có lazy loading
- **Files:**
  - `src/components/AuthorBookCard.tsx`
  - `src/components/PromoBanner.tsx`
- **Giải pháp:** Sử dụng Next.js Image component

#### 2.2. Bundle Size
- **Vấn đề:** 
  - Có thể import toàn bộ library thay vì chỉ import cần thiết
  - Không có code splitting cho routes
- **Giải pháp:** 
  - Dynamic imports cho heavy components
  - Analyze bundle size với `@next/bundle-analyzer`

#### 2.3. API Calls
- **Vấn đề:** 
  - Một số nơi fetch data ở client thay vì server
  - Không có caching strategy
- **Giải pháp:** 
  - Sử dụng Server Components nhiều hơn
  - Implement React Query hoặc SWR cho client-side data fetching với caching

### 3. **Architecture**

#### 3.1. API Layer
- **Vấn đề:** 
  - Logic API call bị rải rác (trong components, actions, dal.ts)
  - Không có centralized API client
- **Giải pháp:** 
  - Tạo API service layer
  - Centralize all API calls

#### 3.2. State Management
- **Vấn đề:** 
  - Sử dụng nhiều useState, không có global state management
  - Props drilling ở một số nơi
- **Giải pháp:** 
  - Xem xét sử dụng Zustand hoặc Context API cho global state
  - Hoặc tiếp tục với Server Components pattern

#### 3.3. File Structure
- **Vấn đề:** 
  - Một số components quá lớn (200+ lines)
  - Logic và UI không được tách biệt rõ ràng
- **Giải pháp:** 
  - Split large components thành smaller ones
  - Extract business logic vào custom hooks

### 4. **Testing**

#### 4.1. Unit Tests
- **Vấn đề:** Không có unit tests
- **Giải pháp:** 
  - Setup Jest và React Testing Library
  - Viết tests cho critical components và utilities

#### 4.2. Integration Tests
- **Vấn đề:** Không có integration tests cho API routes
- **Giải pháp:** 
  - Setup testing cho API routes
  - Test authentication và authorization flows

### 5. **Documentation**

#### 5.1. Code Comments
- **Vấn đề:** 
  - Một số code không có comments
  - Comments bằng tiếng Việt, nên có English version
- **Giải pháp:** 
  - Thêm JSDoc comments cho functions
  - Document complex logic

#### 5.2. API Documentation
- **Vấn đề:** Không có API documentation
- **Giải pháp:** 
  - Tạo OpenAPI/Swagger documentation
  - Hoặc ít nhất là README với API endpoints list

### 6. **Accessibility**

#### 6.1. ARIA Labels
- **Vấn đề:** 
  - Một số interactive elements thiếu aria-labels
  - Không có keyboard navigation support ở một số nơi
- **Giải pháp:** 
  - Thêm proper ARIA attributes
  - Test với screen readers

### 7. **SEO**

#### 7.1. Metadata
- **Vấn đề:** 
  - `src/app/layout.tsx` có metadata mặc định "Create Next App"
  - Không có dynamic metadata cho các pages
- **Giải pháp:** 
  - Update metadata cho từng page
  - Add Open Graph tags

---

## 🌐 Routes Có Thể Lộ Trên Browser

> **Lưu ý:** Tất cả API routes đã có authentication check. NestJS backend sẽ validate token và check role permissions. Routes chỉ proxy requests đến NestJS với Bearer token.

### 1. **API Routes Có Thể Truy Cập Trực Tiếp**

Tất cả API routes trong `src/app/api/` đều có thể được truy cập trực tiếp từ browser, **NHƯNG** đã được bảo vệ:

#### ✅ Tất Cả Routes Đã Có Authentication Check:
- `GET /api/category/list` - ✅ Có auth check, NestJS validate role
- `GET /api/books/[id]` - ✅ Có auth check, NestJS validate role
- `GET /api/chapters/[id]` - ✅ Có auth check, NestJS validate role
- `GET /api/books/admin/all` - ✅ Có auth check, NestJS validate ADMIN role
- `GET /api/orders/admin/all` - ✅ Có auth check, NestJS validate ADMIN role
- `GET /api/users/[id]` - ✅ Có auth check, NestJS validate permissions
- `PATCH /api/users/[id]` - ✅ Có auth check + validation, NestJS validate permissions
- `DELETE /api/users/[id]` - ✅ Có auth check, NestJS validate ADMIN role
- `POST /api/books` - ✅ Có auth check + validation, NestJS validate permissions
- `PATCH /api/books/[id]` - ✅ Có auth check, NestJS validate permissions
- `DELETE /api/books/[id]` - ✅ Có auth check, NestJS validate permissions
- `POST /api/category` - ✅ Có auth check + validation, NestJS validate permissions
- `POST /api/chapters` - ✅ Có auth check + validation, NestJS validate permissions
- `PATCH /api/chapters/[id]` - ✅ Có auth check, ⚠️ THIẾU VALIDATION (cần fix)

### 2. **Cách Import/Handle Routes Trên Browser**

#### Client-Side Fetch:
```typescript
// Có thể được gọi từ browser console hoặc bất kỳ client-side code nào
fetch('/api/books/admin/all?page=1&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));

// Hoặc với authentication (nếu có cookie)
fetch('/api/users/123', {
  credentials: 'include' // Include cookies
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Server Actions:
```typescript
// Server actions có thể được gọi từ client components
import { createCategoryAction } from '@/app/actions/book';

// Trong component
await createCategoryAction(formData);
```

### 3. **Rủi Ro Đã Được Giảm Thiểu**

1. **Information Disclosure:** ✅ ĐÃ ĐƯỢC BẢO VỆ
   - Tất cả routes yêu cầu authentication
   - NestJS validate token và permissions
   - Không thể enumerate users/books/orders mà không có valid token

2. **Unauthorized Access:** ✅ ĐÃ ĐƯỢC BẢO VỆ
   - Tất cả routes có auth check ở Next.js layer
   - NestJS backend có guards để check role và permissions
   - Không thể access admin endpoints mà không có ADMIN role

3. **Rate Limiting:** ⚠️ SẼ ĐƯỢC XỬ LÝ BỞI ARCJET
   - Hiện tại chưa có rate limiting
   - Arcjet sẽ implement rate limiting khi deploy
   - Sẽ prevent spam và DDoS attacks

### 4. **Giải Pháp Đã Implement & Sẽ Implement**

#### 4.1. Authentication ✅ ĐÃ CÓ
- **Trạng thái:** ✅ ĐÃ IMPLEMENT
- **Chi tiết:** 
  - Tất cả API routes có `getSession()` check
  - `axios-server.ts` tự động attach Bearer token
  - NestJS backend validate token và check permissions
- **Không cần thêm middleware:** Vì mỗi route đã có check riêng

#### 4.2. Rate Limiting ✅ SẼ CÓ VỚI ARCJET
- **Trạng thái:** ⚠️ SẼ IMPLEMENT VỚI ARCJET
- **Chi tiết:** 
  - Arcjet sẽ handle rate limiting khi deploy
  - Có thể config trong Arcjet dashboard
  - Không cần implement manual rate limiting

#### 4.3. CORS Configuration ⚠️ CẦN THÊM
- **Trạng thái:** ⚠️ CHƯA CÓ
- **Giải pháp:** Thêm vào `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: process.env.ALLOWED_ORIGIN || 'https://yourdomain.com',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization',
        },
        {
          key: 'Access-Control-Allow-Credentials',
          value: 'true',
        },
      ],
    },
  ];
}
```

#### 4.4. Input Validation ✅ ĐÃ CÓ (HẦU HẾT)
- **Trạng thái:** ✅ ĐÃ IMPLEMENT VỚI ZOD
- **Chi tiết:**
  - Tất cả POST routes có Zod validation
  - PATCH routes có validation (trừ `/api/chapters/[id]` - cần fix)
- **Cần fix:** Thêm validation cho `/api/chapters/[id]` PATCH

---

## 🛡️ Arcjet Integration - Runtime Security

> **Kế hoạch:** Sử dụng [Arcjet](https://arcjet.com/) để bảo vệ Next.js application khi deploy. Arcjet cung cấp AI-powered runtime security với các tính năng: rate limiting, bot protection, email validation, và shield protection.

### Tại Sao Cần Arcjet?

1. **Rate Limiting:** Bảo vệ API endpoints khỏi DDoS và brute force attacks
2. **Bot Protection:** Detect và block malicious bots
3. **Email Validation:** Validate email addresses trước khi gửi đến backend
4. **Shield Protection:** Bảo vệ khỏi common attacks (XSS, SQL injection, etc.)
5. **AI-Powered:** Sử dụng AI để detect patterns và threats

### Cách Integrate Arcjet

#### 1. **Installation**
```bash
npm install @arcjet/next
```

#### 2. **Setup trong Middleware**
```typescript
// src/middleware.ts
import arcjet, { detectBot, fixedWindow, validateEmail } from "@arcjet/next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    // Rate limiting cho API routes
    fixedWindow({
      mode: "LIVE", // hoặc "DRY_RUN" để test
      window: "1m", // 1 minute
      max: 10, // 10 requests per minute
    }),
    // Bot detection
    detectBot({
      mode: "LIVE",
      block: ["AUTOMATED"], // Block automated bots
    }),
  ],
});

export async function middleware(request: NextRequest) {
  // Apply Arcjet protection cho API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const decision = await aj.protect(request);
    
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
```

#### 3. **Email Validation cho Signup/Signin**
```typescript
// src/app/actions/auth.ts
import { validateEmail } from "@arcjet/next";

export async function signupAction(state: FormState, formData: FormData) {
  const email = formData.get("email") as string;
  
  // Validate email với Arcjet
  const emailDecision = await validateEmail({
    email,
    block: ["DISPOSABLE", "INVALID"],
  });
  
  if (emailDecision.isDenied()) {
    return { message: "Email không hợp lệ hoặc là disposable email" };
  }
  
  // ... rest of signup logic
}
```

#### 4. **Shield Protection cho API Routes**
```typescript
// src/app/api/books/route.ts
import { shield } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: "LIVE",
      // Block common attack patterns
      block: ["XSS", "SQL_INJECTION", "CSRF"],
    }),
  ],
});

export async function POST(req: Request) {
  const decision = await aj.protect(req);
  
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Request blocked by security rules" },
      { status: 403 }
    );
  }
  
  // ... rest of handler
}
```

#### 5. **Environment Variables**
```bash
# .env.local
ARCJET_KEY=ajkey_xxx  # Get from https://arcjet.com/
```

### Arcjet sẽ giải quyết các vấn đề:

✅ **Rate Limiting** - Thay thế manual rate limiting implementation  
✅ **Bot Protection** - Detect và block malicious bots tự động  
✅ **Email Validation** - Validate emails trước khi gửi đến backend  
✅ **Shield Protection** - Bảo vệ khỏi XSS, SQL injection, CSRF attacks  
✅ **AI-Powered Detection** - Sử dụng AI để detect threats và patterns  

### Lưu ý khi Deploy:

1. **Get API Key:** Đăng ký tại [arcjet.com](https://arcjet.com/) để lấy API key
2. **Test Mode:** Bắt đầu với `mode: "DRY_RUN"` để test mà không block requests
3. **Monitor:** Theo dõi Arcjet dashboard để xem các threats và patterns
4. **Tune Rules:** Điều chỉnh rules dựa trên traffic patterns của bạn
5. **Production:** Chuyển sang `mode: "LIVE"` khi đã test kỹ

### Tài Liệu Tham Khảo:

- [Arcjet Documentation](https://docs.arcjet.com/)
- [Arcjet Next.js Integration](https://docs.arcjet.com/quickstart/nextjs)
- [Arcjet Rate Limiting](https://docs.arcjet.com/protect/rate-limit)
- [Arcjet Bot Detection](https://docs.arcjet.com/protect/bot-detection)

---

## 📝 Tổng Kết

### Ưu Tiên Cao (Cần Fix Ngay Trước Khi Deploy):
1. 🔴 **Xóa console.log trong `src/lib/token.ts`** - Lộ thông tin nhạy cảm
2. 🔴 **Thêm validation cho `/api/chapters/[id]` PATCH** - Thiếu input validation
3. ✅ Authentication check - ĐÃ CÓ (tất cả routes)
4. ✅ Authorization check - ĐƯỢC XỬ LÝ BỞI NESTJS
5. ✅ Input validation - ĐÃ CÓ (hầu hết routes)

### Ưu Tiên Trung Bình (Sẽ được giải quyết bởi Arcjet):
1. ✅ **Rate Limiting** - Sẽ implement với Arcjet
2. ✅ **Bot Protection** - Sẽ implement với Arcjet
3. ✅ **Shield Protection** - Sẽ implement với Arcjet
4. ⚠️ Thêm security headers trong `next.config.ts`
5. ✅ Error handling - ĐÃ ĐƯỢC XỬ LÝ ĐÚNG

### Ưu Tiên Thấp (Có thể làm sau):
1. 📝 Cải thiện TypeScript types (thay `any` bằng proper types)
2. 📝 Thêm tests (unit tests, integration tests)
3. 📝 Cải thiện documentation
4. 📝 Optimize performance (image optimization, bundle size)
5. 📝 Fix hardcoded values trong `next.config.ts`

---

## 🔗 Tài Liệu Tham Khảo

- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js API Routes Security](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Arcjet Documentation](https://docs.arcjet.com/)
- [Arcjet Next.js Integration](https://docs.arcjet.com/quickstart/nextjs)

---

**Lưu ý:** File này được tạo tự động từ phân tích codebase. Vui lòng review và update khi có thay đổi trong code.

