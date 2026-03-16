## Project Structure & Code Quality Review

**Project:** BookStudio Dashboard  
**Stack:** Next.js App Router, TypeScript, Tailwind, shadcn/ui  
**Target deploy:** Vercel + Cloudflare

---

## 1. Đánh giá cấu trúc thư mục

### 1.1. `src/app` (routing & pages)

- **Điểm tốt**
  - Đã dùng App Router chuẩn: `src/app/(admin)/...`, `src/app/(auth)/...`, `src/app/page.tsx`.
  - Phân tách layout theo group route: `(admin)/layout.tsx`, `(auth)/...` là đúng hướng.
  - Có `actions/` riêng cho server actions (`auth.ts`, `book.ts`) – tốt cho separation of concerns.

- **Điểm nên cải thiện**
  - **Trộn route cũ/mới**: có cả `src/app/(admin)/dashboard/...` và `src/app/dashboard/...` (ví dụ `src/app/dashboard/orders/page.tsx`, `src/app/dashboard/users/page.tsx`).
    - **Đề xuất**: chọn **một convention**:
      - Hoặc dùng toàn bộ nhóm `(admin)` → `src/app/(admin)/dashboard/...`
      - Hoặc chuyển các route cũ từ `src/app/dashboard/...` vào `(admin)` và xóa bản cũ.
  - **`actions/` nên group theo domain**:
    - Hiện có `actions/auth.ts`, `actions/book.ts`.
    - Khi hệ thống lớn hơn, nên đổi thành:
      - `src/app/(auth)/actions/auth.ts`
      - `src/app/(admin)/dashboard/books/actions.ts`
      - Hoặc tách ra `src/server/actions/*` nếu muốn tách khỏi UI.

### 1.2. `src/components`

- **Điểm tốt**
  - Đã tách khá rõ:
    - UI primitives: `src/components/ui/*` (shadcn-style)
    - Dashboard feature components: `BooksDashboardClient.tsx`, `OrdersDashboardClient.tsx`, v.v.
    - AI-related: `src/components/action-ai/*`.
  - Có các components theo domain: `BookDetail`, `UserInfoCard`, `UserOrdersCard`, v.v.

- **Điểm chưa tối ưu & gợi ý gom nhóm**
  - **Hiện trạng**: rất nhiều file nằm thẳng trong `src/components` → khó nhìn khi project lớn.
  - **Đề xuất tách theo feature (Feature folders)**:
    - `src/components/books/`
      - `BooksDashboardClient.tsx`
      - `CardBooks.tsx`
      - `RowBook.tsx`
      - `DialogBook.tsx`
      - `BookDetail.tsx`
      - `BookActions.tsx`
      - `BookClubCard.tsx`
      - `AuthorBookCard.tsx`
      - `PromoBanner.tsx`
    - `src/components/categories/`
      - `CategoriesDashboardClient.tsx`
      - `CategoryBooksClient.tsx`
      - `CategoryFolder.tsx`
      - `DialogCategory.tsx`
    - `src/components/orders/`
      - `OrdersDashboardClient.tsx`
      - `CardRecentOrders.tsx`
      - `OrderRow.tsx`
      - `OrderTableCell.tsx`
      - `OrderDetailDialog.tsx`
      - `UserOrdersCard.tsx`
      - `OrderItemCard.tsx`
    - `src/components/users/`
      - `UserTableContainer.tsx`
      - `UserInfoCard.tsx`
      - `UserActions.tsx`
      - `EditUser.tsx`
    - `src/components/dashboard/`
      - `CardQuickStats.tsx`
      - `CardRecentActivity.tsx`
      - `Todolist.tsx`
      - `ChartArea.tsx`
      - `CardCalender.tsx`
      - `StatCard.tsx`
      - `StatItem.tsx`
      - `BackgroundBlobs.tsx` (nếu còn dùng cho layout)
    - `src/components/layout/`
      - `AppSidebar.tsx`
      - `Navbar.tsx`
      - `eNavigationLayout.tsx` (nên rename, xem phần dưới)
      - `CopilotSidebar.tsx` (nếu có)

  → Cách này **dễ tìm code theo domain**, giảm cognitive load, và tạo tiền đề cho **code splitting theo route/feature**.

### 1.3. `src/lib`

- **Điểm tốt**
  - Đã có phân chia khá rõ:
    - `axios-server.ts`, `api-error.ts`, `dal.ts`, `session.ts`, `token.ts`
    - `type.ts`, `types.ts`, `zod.ts`, `utils.ts`
  - Sử dụng `axiosServer` + interceptor + session là hợp lý.

- **Gợi ý**
  - Đặt tên đồng nhất:
    - Hiện có cả `type.ts` và `types.ts` → dễ gây nhầm.
    - **Đề xuất**:
      - Đổi `type.ts` → `domain-types.ts` hoặc gộp vào `types.ts` nếu trùng domain.
  - `dal.ts` (data access layer) đang chứa nhiều hàm khác domain:
    - `getAdminBooks`, `getAllOrders`, `getAllcategories`, `getCategoriesList`.
    - **Đề xuất**:
      - Tách theo domain:
        - `src/lib/dal/books.ts`
        - `src/lib/dal/orders.ts`
        - `src/lib/dal/categories.ts`
      - `src/lib/dal/index.ts` chỉ re-export.

---

## 2. Đặt tên file/hàm/biến – điểm chưa ổn

### 2.1. File/component name

- **`useStatsRender.tsx.tsx`** (trong `src/components/action-ai/`):
  - Sai chuẩn, `.tsx.tsx` là lỗi rõ ràng.
  - **Đề xuất:** đổi thành `useStatsRender.tsx`.

- **`eNavigationLayout.tsx`**
  - Tên khó hiểu, không rõ nghĩa (e = ebook? extended?).
  - Component export là `EBookLayout` → mismatch tên file & tên component.
  - **Đề xuất:** đổi file thành `EBookLayout.tsx` hoặc `AdminShell.tsx`/`DashboardLayout.tsx`.

- **`CardCalender.tsx`**
  - Chính tả: đúng phải là `CardCalendar`.
  - **Đề xuất:** rename thành `CardCalendar.tsx`.

- **`NavItem.tsx`, `StatusTag.tsx`**
  - Nếu vẫn dùng, nên group về thư mục tương ứng (`layout/` hoặc `books/`…), không để lẻ trong root `components`.

- **`Progress.tsx` (component custom)** vs `ui/progress.tsx`
  - Dễ nhầm lẫn với progress bar của shadcn.
  - **Đề xuất:** nếu còn dùng thì rename thành `ActionProgress.tsx` hoặc `StepsProgress.tsx`.

### 2.2. Hàm/biến `any` & props lỏng

- Một số components nhận props `any`, ví dụ:
  - `BooksDashboardClient`, `OrdersDashboardClient`, `BookActions`, `OrderDetailDialog`, v.v.
  - Điều này không làm bundle to lên, nhưng:
    - Khó optimize (React Compiler, build-time checks)
    - Dễ bug runtime, khó refactor.
  - **Đề xuất:**
    - Tạo type/domain rõ ràng trong `src/lib/types.ts` rồi import vào components.

### 2.3. Naming convention

- Nhìn chung naming khá ổn (PascalCase cho components, camelCase cho hàm/biến).
- Điểm cần chú ý:
  - Tránh comment tiếng Việt trong tên schema (`createBookApiSchema` ok, nhưng comment nên gọn, rõ).
  - Đồng nhất suffix:
    - Hooks: `useXxx`.
    - Components: không nên kết thúc bằng `Client` trừ khi thực sự cần phân biệt server/client (ở App Router, file có `"use client"` là đủ).

---

## 3. Ảnh hưởng tới bundle size & performance

Dự định deploy trên **Vercel + Cloudflare**, nên quan trọng:
- Bundle JS **nhỏ nhất có thể**.
- Tận dụng **Edge / CDN**.

### 3.1. Các điểm có thể làm bundle to

- **Client Components to & phức tạp**
  - `BooksDashboardClient.tsx`, `OrdersDashboardClient.tsx`, `Todolist.tsx`, `Dashboard page client`, các components AI (`useDashboardRender`, `useTodoTool`, `useBookFiltersTool`, v.v.).
  - Các file này import rất nhiều từ:
    - `@dnd-kit/*`
    - `@copilotkit/*`
    - `recharts`
    - UI components shadcn.
  - **Rủi ro**: Nếu các file này nằm trên route được load sớm (ví dụ `/dashboard`), initial bundle sẽ to.

- **Copilot/AI runtime**
  - `eNavigationLayout.tsx` import `@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/react-core/v2/styles.css`, v.v.
  - Nếu layout này được dùng cho toàn bộ `(admin)`, mọi page admin đều phải load AI sidebar + styles, kể cả khi user không dùng AI.
  - **Đề xuất:**
    - Tách Copilot sidebar thành **dynamic import**:
      - `const CopilotSidebar = dynamic(() => import('./CopilotSidebar'), { ssr: false });`
    - Chỉ mount Copilot khi user mở panel hoặc ở những page thực sự cần.

- **Charts / DnD libraries**
  - `recharts`, `@dnd-kit/*`, `react-resizable-panels`, `embla-carousel-react`… đều là libraries khá nặng.
  - **Đề xuất:**
    - Dynamic import các component sử dụng heavy libs:
      - `ChartArea`, các chart khác, drag-and-drop dashboard.
    - Hoặc lazy load theo tab (ví dụ: chỉ khi user click vào tab "Analytics" mới load chart).

### 3.2. Server vs Client Components

- Nhiều page admin đang là **client component toàn bộ**, trong khi:
  - Data fetch có thể đưa lên server component.
  - Chỉ phần interactive cần `"use client"`.
- **Đề xuất:**
  - Pattern:
    - `page.tsx` → **server component**:
      - Fetch data bằng `axiosServer` hoặc DAL.
      - Truyền data xuống `<ClientComponent initialData={...} />`.
    - `ClientComponent.tsx` → `"use client"` và chỉ lo UI + interactions.
  - Điều này giúp:
    - Giảm bundle size client (vì fetch logic & axios không bị bundle xuống client).
    - Tận dụng edge caching của Vercel tốt hơn.

### 3.3. Imports & tree-shaking

- shadcn/ui đã được tách từng file → ok cho tree-shaking.
- Cần tránh import kiểu `import * as X from 'recharts'` trong client components:
  - Thay bằng import từng phần: `import { LineChart, Line } from 'recharts';`.

---

## 4. Gợi ý tối ưu riêng cho Vercel + Cloudflare

### 4.1. Vercel

- **Edge / Node runtimes**
  - Với các route không dùng Node APIs nặng, có thể cân nhắc đặt `export const runtime = 'edge';` để chạy trên edge.
  - Tuy nhiên vì bạn đang dùng `axios` + `jose` + cookies server, nên nhiều chỗ sẽ phải ở Node runtime – chấp nhận được.

- **Caching**
  - Với các API đọc (GET) như `/api/category/list`, `/api/books/admin/all`, có thể:
    - Thêm header `Cache-Control` hợp lý.
    - Hoặc dùng `revalidate` ở server component (ISR).

### 4.2. Cloudflare (trước app / cho static assets)

- **Static assets**
  - Ảnh, fonts, static files đã được Next + Vercel tự động tối ưu, Cloudflare sẽ cache khá tốt.
  - Đảm bảo không disable caching không cần thiết.

---

## 5. Checklist việc cần làm (ưu tiên)

- **Cấu trúc & naming**
  - [ ] Dọn lại `src/components` theo **feature folders** (books, orders, users, dashboard, layout, ai).
  - [ ] Rename:
    - [ ] `useStatsRender.tsx.tsx` → `useStatsRender.tsx`
    - [ ] `eNavigationLayout.tsx` → `EBookLayout.tsx` hoặc `AdminShell.tsx`
    - [ ] `CardCalender.tsx` → `CardCalendar.tsx`
    - [ ] `Progress.tsx` (custom) → `ActionProgress.tsx` (nếu còn dùng)
  - [ ] Hợp nhất `type.ts` & `types.ts` hoặc đặt lại tên cho rõ domain.

- **Bundle & performance**
  - [ ] Đảm bảo tất cả page `page.tsx` trong `(admin)` là **server components**, chỉ wrap phần interactive bằng client components.
  - [ ] Dynamic import cho:
    - [ ] Copilot sidebar / AI panel.
    - [ ] Charts (Recharts), DnD (dnd-kit), carousel, v.v.
  - [ ] Tách DAL theo domain (`src/lib/dal/books.ts`, `orders.ts`, `categories.ts`).

- **Deploy & security**
  - [ ] Giữ auth/role check ở NestJS như hiện tại.
  - [ ] Thêm/kiểm tra `security headers` trong `next.config.ts`.
  - [ ] Tích hợp Arcjet cho rate limiting, bot detection, email validation, shield (tham khảo `https://arcjet.com/` và docs của họ).

---

## 6. Kết luận ngắn

- **Cấu trúc hiện tại**: ổn ở mức MVP, nhưng khi scale sẽ khó quản lý nếu không chuyển sang **feature-based folders**.
- **Naming**: đa số tốt, chỉ có vài chỗ sai chuẩn (`.tsx.tsx`, chính tả, tên file không khớp component).
- **Bundle/perf**: điểm chính cần chú ý là **copilot/AI + charts + DnD** trong client components – nên được **lazy/dynamic import** và tách khỏi layout global.
- Sau khi refactor nhẹ theo các gợi ý trên, dự án sẽ **gọn, dễ bảo trì**, và **deploy lên Vercel + Cloudflare** sẽ mượt hơn, ít risk về bundle quá to hoặc latency cao.


