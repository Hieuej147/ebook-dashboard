import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";

interface Chapter {
  title: string;
  description?: string;
  content: string;
  chapterNumber: number;
}

interface ChapterTabProps {
  chapter: Chapter;
  isGenerating?: boolean;
  onGenerateChapterContent?: () => void;
  onContentChange?: (val: string) => void;
  isFullScreen?: boolean;
}

const ChapterEditTab = ({
  chapter,
  isGenerating,
  onGenerateChapterContent,
  onContentChange,
  isFullScreen,
}: ChapterTabProps) => {
  const [localText, setLocalText] = useState(chapter?.content || "");
  // ✅ Sync khi đổi sang chương khác
  useEffect(() => {
    setLocalText(chapter?.content || "");
  }, [chapter?.chapterNumber]);
  // ✅ Sync khi AI viết xong (isGenerating: true → false)
  const prevGenerating = useRef(isGenerating);
  useEffect(() => {
    if (prevGenerating.current === true && isGenerating === false) {
      setLocalText(chapter?.content || "");
    }
    prevGenerating.current = isGenerating;
  }, [isGenerating, chapter?.content]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  };
  const handleBlur = () => {
    if (localText !== chapter?.content) {
      onContentChange?.(localText);
    }
  };
  return (
    <div className="h-full w-full flex flex-col bg-primary-foreground">
      {/* VÙNG SOẠN THẢO (EDITOR) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/80 border border-purple-100 rounded-full shadow-xl animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                <Sparkles className="h-3 w-3 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-sm font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI writing content...
              </span>
            </div>
          </div>
        )}
        <textarea
          value={localText}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly={isGenerating}
          placeholder={
            isGenerating
              ? ""
              : "Hãy để AI bắt đầu hoặc tự viết nội dung tại đây..."
          }
          className="flex-1 w-full p-8 md:p-16 resize-none outline-none text-lg leading-loose font-serif bg-transparent overflow-y-auto"
        />

        {/* Chỉ dẫn ẩn hiện khi hover */}
        <div className="absolute bottom-4 left-8 text-[10px] text-slate-300 uppercase tracking-widest font-bold">
          {isFullScreen ? "Zen Mode Active" : "Markdown Supported"}
        </div>
        {isGenerating && (
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-ping" />
        )}
      </div>
    </div>
  );
};

const ChapterViewTab = ({
  content,
  title,
}: {
  content: string;
  title: string;
}) => {
  return (
    <div className="h-full w-full bg-white overflow-y-auto p-8 md:p-16">
      <article className="prose prose-slate lg:prose-xl max-w-4xl mx-auto font-serif">
        <h1 className="text-4xl font-black mb-8 border-b pb-4">{title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
};
export { ChapterEditTab, ChapterViewTab };
