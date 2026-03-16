import { useState, useEffect } from "react";
import { AgentState, Chapter } from "@/lib/types";

export function useChapterStreaming(state: AgentState) {
  const [streamingChapter, setStreamingChapter] =
    useState<Partial<Chapter> | null>(null);

  useEffect(() => {
    // Duyệt qua tất cả các key trong state của Agent
    Object.keys(state).forEach((k) => {
      if (!k.startsWith("chapter_stream")) return;

      const value = (state as any)[k];
      if (value === null) {
        setStreamingChapter(null);
        return;
      }

      // Phân tách key: ["chapter_stream", "content", "2", "Tiêu đề"]
      const [, streamType, chapterNumber, title] = k.split(".");

      setStreamingChapter((prev) => {
        const num = Number(chapterNumber);

        // Nếu là chương mới hoặc bắt đầu stream
        if (prev?.chapterNumber !== num) {
          return {
            chapterNumber: num,
            title: title,
            content: streamType === "content" ? value : "",
          };
        }

        // Cập nhật nội dung đang chảy về
        return {
          ...prev,
          [streamType]: value,
        };
      });
    });
  }, [state]);

  return streamingChapter;
}
