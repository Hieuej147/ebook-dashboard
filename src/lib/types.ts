// Sửa thành String Enum
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

// Bạn nên sửa luôn cả CustomerType cho an toàn, vì NestJS chắc cũng trả về chữ
export enum CustomerType {
  NORMAL = "NORMAL",
  PREMIUM = "PREMIUM",
}

// ... các interface bên dưới giữ nguyên
export type FormState =
  | {
      error?: {
        email?: string[] | string;
        password?: string[] | string;
      };
      message?: string;
    }
  | undefined
  | null;

export interface Chapter {
  chapterNumber: number;
  title: string;
  description: string;
  content: string;
}

export interface Log {
  message: string;
  done: boolean;
}

export interface Book {
  title: string;
  author?: string;
  topic: string;
  writingStyle?: string;
  chapters: Chapter[];
}

export interface Source {
  url: string;
  title: string;
  content: string;
  raw_content?: string;
  score?: number;
}

export type Sources = Record<string, Source>;

export interface AgentState {
  book: Book;
  sources: Sources;
  selectedChapterNumber: number;
  logs: Log[];
  active_worker: string
}
