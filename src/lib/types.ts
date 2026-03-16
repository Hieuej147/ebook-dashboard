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

export interface Log {
  message: string;
  done: boolean;
}

export interface Book {
  title: string;
  author?: string; // Thêm author cho khớp với Python
  topic: string;
  writingStyle?: string;
  chapters: Chapter[];
}

export interface Source {
  url: string;
  title: string;
  content: string;
  raw_content?: string; // Thêm trường này cho extract_node
  score?: number;
}

export type Sources = Record<string, Source>;

// Hợp nhất BookState vào AgentState. CopilotKit sẽ tự động
// inject thêm mảng 'messages' vào state này ở phía dưới
export interface AgentState {
  book: Book;
  sources: Sources;
  selectedChapterNumber: number;
  logs: Log[];
}
