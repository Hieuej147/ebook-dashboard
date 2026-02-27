export enum Role {
  ADMIN,
  USER,
}
export enum CustomerType {
  NORMAL,
  PREMIUM,
}
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

export interface Logs {
  message: string;
  done: boolean;
}

export interface Book {
  title: string;
  chapters: Chapter[];
  topic: string;
  writingStyle: string;
}

// Định nghĩa thêm interface cho State của Agent
export interface BookState {
  book: Book;
  selectedChapterNumber: number;
  logs: Logs[]
}
