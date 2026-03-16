"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, Role } from "@copilotkit/runtime-client-gql";
import { AgentState, Chapter } from "@/lib/types";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useHumanInTheLoop, ToolCallStatus } from "@copilotkit/react-core/v2";
import { useLangChainAgent } from "@/app/provider/AgentContext";

const styleItems = [
  { label: "Informative", value: "informative" },
  { label: "Storytelling", value: "storytelling" },
  { label: "Casual", value: "casual" },
  { label: "Professional", value: "professional" },
  { label: "Humorous", value: "humorous" },
];

function ChatFillForm() {
  const { state, setState, running: isRunning, nodeName } = useLangChainAgent();
  useHumanInTheLoop(
    {
      name: "collectInformationBookOutline",
      description:
        "Collect shipping book outline from the user before placing an order",
      parameters: z.object({
        suggestedTitle: z
          .string()
          .optional()
          .describe("A title suggested by AI based on context"),
        suggestedAuthor: z.string().optional(),
      }),
      render: ({ args, status, respond }) => {
        // Form này sẽ hiện ngay trong bong bóng chat của Assistant
        const [formData, setFormData] = useState({
          title: args.suggestedTitle || "",
          author: args.suggestedAuthor || "",
          topic: "",
          chapters: 3,
        });

        if (status === ToolCallStatus.Executing && respond) {
          return (
            <div className="p-4 border border-purple-200 rounded-xl bg-white shadow-sm space-y-3 my-2 animate-in fade-in slide-in-from-bottom-2">
              <h4 className="text-sm font-bold text-purple-700 flex items-center gap-2">
                <Plus size={14} /> Quick Book Setup
              </h4>

              <div className="space-y-2">
                <input
                  placeholder="Book Title"
                  className="w-full text-xs p-2 border rounded-md focus:ring-1 ring-purple-500 outline-none"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <input
                  placeholder="Author Name"
                  className="w-full text-xs p-2 border rounded-md focus:ring-1 ring-purple-500 outline-none"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Chapters"
                    className="w-20 text-xs p-2 border rounded-md outline-none"
                    value={formData.chapters}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chapters: Number(e.target.value),
                      })
                    }
                  />
                  <select
                    className="flex-1 text-xs p-2 border rounded-md outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                  >
                    <option value="General">Topic: General</option>
                    <option value="Technology">Technology</option>
                    <option value="Story">Storytelling</option>
                  </select>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                onClick={() => {
                  // 1. Cập nhật State chung để Dialog (thủ công) cũng nhận được
                  setState({
                    ...state,
                    book: {
                      ...state?.book,
                      title: formData.title,
                      author: formData.author,
                      topic: formData.topic,
                      chapters: [], // Reset để chuẩn bị gen mới
                    },
                  });

                  // 2. Trả kết quả về cho AI để nó biết đã điền xong
                  respond(formData);
                }}
              >
                Apply to Draft
              </Button>
            </div>
          );
        }

        if (status === ToolCallStatus.Complete) {
          return (
            <div className="p-2 text-xs text-slate-500 italic">
              ✓ Details applied to your book draft.
            </div>
          );
        }
        return null;
      },
    },
    [],
  );

  return null;
}

function ChatApprovalTool({
  setIsOpen,
  setSteps,
}: {
  setIsOpen: (open: boolean) => void;
  setSteps: (step: number) => void;
}) {
  useHumanInTheLoop(
    {
      name: "approve_and_save_book_chat",
      description:
        "Call this to let the user review the generated outline in the main Dialog before finalizing.",
      parameters: z.object({
        title: z.string().describe("The final title of the book"),
        chapterCount: z.number().describe("Total number of chapters generated"),
      }),
      render: ({ args, status, respond }) => {
        if (status === ToolCallStatus.Executing && respond) {
          return (
            <div className="p-4 border-2 border-blue-200 rounded-xl bg-blue-50/30 space-y-3 my-2 animate-in zoom-in-95">
              <h4 className="font-bold text-sm text-blue-700">
                Outline Ready! 📝
              </h4>
              <p className="text-xs text-slate-600">
                Dàn ý cho <strong>"{args.title}"</strong> đã xong. Bạn có muốn
                xem lại trong Dialog để tùy chỉnh và lưu không?
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-semibold"
                  onClick={() => {
                    // 1. Bật Dialog và nhảy thẳng tới bước Review
                    setIsOpen(true);
                    setSteps(2);

                    // 2. Báo AI là người dùng đã đồng ý xem
                    respond({ action: "review_in_dialog" });
                  }}
                >
                  Review in Dialog
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                  onClick={() => respond({ action: "cancel" })}
                >
                  Not now
                </Button>
              </div>
            </div>
          );
        }
        return null;
      },
    },
    [],
  );

  return null;
}

export default function DialogBook() {
  const { state, setState, running, nodeName } = useCoAgent<AgentState>({
    name: "default", // Phải khớp với name ở Python và route.ts
    initialState: {
      book: {
        title: "",
        topic: "",
        author: "",
        chapters: [],
      },
      selectedChapterNumber: 1,
      logs: [],
    },
  });
  const [steps, setSteps] = useState(1);
  const [isOpen, setIsOpen] = useState(false); // Thêm state để AI có thể mở Dialog
  const [writingStyle, setWritingStyle] = useState("informative");
  const [isSaving, setIsSaving] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [localChapterCount, setLocalChapterCount] = useState(3);
  const router = useRouter();
  const { appendMessage } = useCopilotChat();
  const chapters = state?.book?.chapters || [];

  const updateBookField = (field: string, value: any) => {
    setState({
      ...state,
      book: {
        ...state?.book,
        [field]: value,
      },
    });
  };
  const handleGenerateOutline = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Thu thập dữ liệu từ Form
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const title = (formData.get("title") as string) || "Untitled Book";
    const chaptersCount = (formData.get("chapters") as string) || "3";
    const topic = (formData.get("topic") as string) || "General";
    const author = (formData.get("author") as string) || "Unknown Author";

    setAuthorName(author);

    // 2. Cập nhật Shared State để Agent nhận được ngữ cảnh ngay lập tức
    setState({
      ...state,
      book: {
        ...state?.book,
        title,
        author,
        topic,
        writingStyle,
        chapters: [], // Reset để hiện Loader
      },
    });

    setSteps(2);

    // 3. Gửi lệnh yêu cầu AI tạo nội dung
    appendMessage(
      new TextMessage({
        content: `[MANUAL_MODE] Generate an eBook outline with EXACTLY ${chaptersCount} chapters for "${title}" about "${topic}". 
      Style: ${writingStyle}. 
      Update the 'update_book_outline' tool ONLY. Do NOT use any approval cards in chat.`,
        role: Role.User,
      }),
    );
  };
  const handleCreateBook = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (chapters.length === 0) return;
    setIsSaving(true); // Bật loading
    try {
      const payload = {
        title: state.book?.title,
        subtitle: state.book?.topic,
        author: authorName || state.book.author, // Dùng biến từ state
        description: `A ${state.book?.writingStyle} book about ${state.book?.topic}`,
        price: 19.99,
        stock: 1,
        sku: `BK-${Date.now()}`,
        categoryId: "8c3d5ebf-f4be-4f4c-bc17-d84e8a457c82",
      };

      const Bookres = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!Bookres.ok) throw new Error("Failed to create book");
      const book = await Bookres.json();
      const chaptersPayload = {
        chapters: chapters.map((ch: any) => ({
          title: ch.title,
          description: ch.description,
          chapterNumber: ch.chapterNumber,
          content: "", // Nội dung sẽ để AI viết ở trang Edit
          bookId: book.id, // Quan trọng: Gán ID sách vừa tạo vào đây
        })),
      };
      const ChapterRes = await fetch("/api/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chaptersPayload),
      });
      if (!ChapterRes.ok) throw new Error("Failed to create chapters");
      router.push(`/dashboard/books/${book.id}/chapters`);
    } catch (error) {
      console.error("Error creating book and chapters:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ChatFillForm />
      <ChatApprovalTool setIsOpen={setIsOpen} setSteps={setSteps} />
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSteps(1); // Reset step khi đóng
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="flex gap-2 bg-purple-500 transition-all sm:px-4 duration-200 ease-in-out hover:bg-purple-600 hover:scale-[1.02] text-white border-none"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add new Book</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          {/* Đưa thẻ form vào trong DialogContent để tránh lỗi Portal */}
          <form onSubmit={(e) => e.preventDefault()}>
            {steps === 1 && (
              <>
                <DialogHeader>
                  <DialogTitle>Add new book</DialogTitle>
                  <DialogDescription>
                    Fill in the details. AI will draft your book structure.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="space-y-4 py-4">
                  <Field>
                    <Label htmlFor="title">Book title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. The Future of AI"
                      onChange={(e) => updateBookField("title", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      placeholder="e.g. John Kevin"
                      onChange={(e) =>
                        updateBookField("author", e.target.value)
                      }
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <Label htmlFor="chapters">Number of chapters</Label>
                      <Input
                        id="chapters"
                        name="chapters"
                        type="number"
                        defaultValue={localChapterCount}
                        min={1}
                      />
                    </Field>
                    <Field>
                      <Label>Writing Style</Label>
                      <Select
                        value={writingStyle}
                        onValueChange={setWritingStyle}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {styleItems.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field>
                    <Label htmlFor="topic">Topic (Optional)</Label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="e.g. Technology and Ethics"
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleGenerateOutline}>
                    Generate Outline with AI
                  </Button>
                </DialogFooter>
              </>
            )}

            {steps === 2 && (
              <>
                <DialogHeader>
                  <DialogTitle>Review Book Outline</DialogTitle>
                  <div className="flex items-center justify-between pt-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Chapters
                    </h2>
                    <p className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                      {chapters.length} chapters
                    </p>
                  </div>
                </DialogHeader>

                <ScrollArea className="h-[300px] pr-4 my-4">
                  <div className="space-y-3 pb-4">
                    {chapters.length > 0 ? (
                      chapters.map((chapter: Chapter, index: number) => (
                        <div
                          key={`chapter-${index}-${chapter.chapterNumber}`} // Dùng index làm key để tránh lỗi trùng title khi AI đang stream
                          className="flex gap-4 p-4 border rounded-xl bg-card relative group hover:border-primary/50 transition-colors shadow-sm"
                        >
                          <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
                            {chapter.chapterNumber || index + 1}
                          </div>
                          <div className="space-y-1 pr-6">
                            <h4 className="font-bold text-sm leading-none">
                              {chapter.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-snug">
                              {chapter.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="absolute right-3 top-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div
                        key="loading-outline"
                        className="flex flex-col items-center justify-center h-[200px] text-muted-foreground gap-2"
                      >
                        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                        <p className="text-sm italic">
                          AI is drafting your outline...
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <DialogFooter className="flex flex-row items-center justify-between sm:justify-between w-full pt-2 border-t">
                  <Button
                    variant="ghost"
                    className="flex gap-1 px-2"
                    onClick={() => setSteps(1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex gap-2"
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                      Add Chapter
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleCreateBook}
                      disabled={running || chapters.length === 0}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : running ? (
                        "AI is drafting..."
                      ) : (
                        "Create eBook"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
