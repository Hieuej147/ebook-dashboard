"use client";
import React, { memo, useEffect, useState } from "react";
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
import { ReviewForm } from "../action-ai/ReviewForm";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";

const styleItems = [
  { label: "Informative", value: "informative" },
  { label: "Storytelling", value: "storytelling" },
  { label: "Casual", value: "casual" },
  { label: "Professional", value: "professional" },
  { label: "Humorous", value: "humorous" },
];

export default memo(function DialogBook() {
  const { state, setState, running, nodeName } = useLangChainAgent();
  const [steps, setSteps] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [writingStyle, setWritingStyle] = useState("informative");
  const [isSaving, setIsSaving] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [localChapterCount, setLocalChapterCount] = useState(3);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { appendMessage } = useCopilotChat();
  const chapters = state?.book?.chapters || [];
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      apiFetch("/api/category/list")
        .then((r) => r.json())
        .then((d) => setCategories(Array.isArray(d) ? d : d.data || []))
        .catch((e) => {
          if (e?.message === "UNAUTHORIZED") return;
          console.error(e);
        });
    }
  }, [isOpen]);

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
        categoryId: selectedCategoryId,
      };

      const Bookres = await apiFetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!Bookres.ok) throw new Error("Failed to create book");
      const book = await Bookres.json();
      if (!book.id) throw new Error("Book ID is null");
      const chaptersPayload = {
        chapters: chapters.map((ch: any) => ({
          title: ch.title,
          description: ch.description,
          chapterNumber: ch.chapterNumber,
          content: "", // Nội dung sẽ để AI viết ở trang Edit
          bookId: book.id, // Quan trọng: Gán ID sách vừa tạo vào đây
        })),
      };
      const ChapterRes = await apiFetch("/api/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chaptersPayload),
      });
      if (!ChapterRes.ok) throw new Error("Failed to create chapters");
      router.push(`/dashboard/books/${book.id}/chapters`);
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") return;
      console.error("Error creating book and chapters:", error);
      toast.error(`Something wrong: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };
  const handleAddChapter = () => {
    const newChapter = {
      chapterNumber: chapters.length + 1,
      title: `Chapter ${chapters.length + 1}`,
      description: "New chapter description",
      content: "",
    };

    setState({
      ...state,
      book: {
        ...state?.book,
        chapters: [...chapters, newChapter],
      },
    });
  };
  const handleDeleteChapter = (index: number) => {
    const newChapters = chapters
      .filter((_: any, i: number) => i !== index)
      .map((ch: any, i: number) => ({
        ...ch,
        chapterNumber: i + 1,
      }));

    setState({
      ...state,
      book: {
        ...state?.book,
        chapters: newChapters,
      },
    });
  };
  return (
    <>
      <ReviewForm setIsOpen={setIsOpen} setSteps={setSteps} />
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
                  <Field>
                    <Label>Category</Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={setSelectedCategoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="choose genre..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                            onClick={() => handleDeleteChapter(index)}
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
                      onClick={handleAddChapter}
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
});
