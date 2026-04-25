"use client";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { arrayMove } from "@dnd-kit/sortable";
import { useLangGraphInterrupt } from "@copilotkit/react-core";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { Loader2 } from "lucide-react";

import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLangChainAgent } from "@/app/provider/AgentContext";
import { EditApprovalCard } from "@/components/action-ai/EditApprovalCard";
import { EditorHeader } from "@/components/chapters/EditorHeader";
import { apiFetch } from "@/lib/api-fetch";
import ChapterSidebar from "@/components/chapters/ChapterSidebar";
import {
  ChapterEditTab,
  ChapterViewTab,
} from "@/components/chapters/ChapterTab";

interface Chapter {
  title: string;
  description: string;
  content: string;
  chapterNumber: number;
}

const EditPage = () => {
  const { id } = useParams();
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [zoom, setZoom] = useState(100);
  const [isOpenSideBar, setIsSideBar] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [localChapters, setLocalChapters] = useState<any[]>([]);
  const [actualBookId, setActualBookId] = useState<string>("");
  const contentRef = useRef<Record<number, string>>({});

  const {
    state,
    setState,
    running: isRunning,
    nodeName,
    sendMessage,
    agent,
  } = useLangChainAgent();
  const { copilotkit } = useCopilotKit();

  const isWritingChapter = isRunning && nodeName === "write_chapter_node";
  const isEditingContent =
    isRunning && nodeName === "edit_chapter_content_node";
  const isUpdatingOutline = isRunning && nodeName === "outline_node";
  const isEditingOutline = isRunning && nodeName === "edit_outline_node";
  const isThinking = isRunning && nodeName === "call_model_node";
  const selectedChapterNumber = state.selectedChapterNumber || 1;

  const isModifyingChapters = isUpdatingOutline || isEditingOutline; // sidebar indicator
  const isGeneratingContent = isWritingChapter; // editor indicator

  // ✅ localChapters is source of truth for rendering
  const chapters = useMemo(() => {
    if (localChapters.length > 0) return localChapters;
    return state.book?.chapters || [];
  }, [localChapters, state.book?.chapters]);

  const currentChapterContent = useMemo(() => {
    return (
      chapters.find(
        (ch: any) => Number(ch.chapterNumber) === Number(selectedChapterNumber),
      ) || {
        title: "",
        description: "",
        content: "",
        chapterNumber: selectedChapterNumber,
      }
    );
  }, [chapters, selectedChapterNumber]);


  useEffect(() => {
    const agentChapters = state.book?.chapters;
    if (agentChapters && agentChapters.length > 0) {
      setLocalChapters(agentChapters);
    }
  }, [state.book?.chapters]); // 👈 Chỉ lắng nghe reference của mảng

  // ✅ Sync contentRef → CopilotKit state when AI finishes
  useEffect(() => {
    if (!isRunning && Object.keys(contentRef.current).length > 0) {
      setState((prev: any) => ({
        ...prev,
        book: {
          ...prev.book,
          chapters: (prev.book?.chapters || []).map((ch: any) => ({
            ...ch,
            content: contentRef.current[ch.chapterNumber] ?? ch.content,
          })),
        },
      }));
      contentRef.current = {};
    }
  }, [isRunning]);

  // ✅ Responsive check
  useEffect(() => {
    const check = () => setIsTabletOrMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Restore data from DB on mount
  useEffect(() => {
    async function restoreData() {
      if (!id) return;
      if (state.book?.chapters?.length > 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [bookRes, chaptersRes] = await Promise.all([
          apiFetch(`/api/books/${id}`),
          apiFetch(`/api/chapters/${id}`),
        ]);
        if (!bookRes.ok || !chaptersRes.ok) throw new Error("API Error");

        const bookData = await bookRes.json();
        const chaptersData = await chaptersRes.json();
        setActualBookId(bookData.id);

        const sanitized = chaptersData.map((ch: any) => ({
          ...ch,
          description: ch.description ?? "",
          content: ch.content ?? "",
        }));
        setLocalChapters(sanitized);
        setState((prev: any) => ({
          ...prev,
          book: {
            title: bookData.title,
            topic: bookData.subtitle || bookData.topic || "",
            author: bookData.author,
            chapters: sanitized,
          },
          selectedChapterNumber: 1,
        }));
      } catch (err: any) {
        if (err?.message === "UNAUTHORIZED") return;
        console.error("Failed to restore data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreData();
  }, [id]);

  const refreshChapters = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/chapters/${id}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      const sanitized = data.map((ch: any) => ({
        ...ch,
        chapterNumber: Number(ch.chapterNumber),
        description: ch.description ?? "",
        content: ch.content ?? "",
      }));
      setLocalChapters(sanitized);
      setState((prev: any) => ({
        ...prev,
        book: {
          ...prev.book,
          chapters: sanitized,
        },
      }));
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") return;
      console.error("Sync error:", err);
    }
  }, [id, agent]);

  const handleSelectChapter = useCallback(
    (chapterNumber: number) => {
      setState({ ...state, selectedChapterNumber: chapterNumber });
      setIsSideBar(false);
    },
    [state],
  );

  const handleAddChapter = useCallback(() => {
    if (isRunning) return;
    sendMessage(
      "Please suggest and add one new chapter to the end of the book outline.",
    );
  }, [isRunning, agent, copilotkit]);

  const handleDeleteChapter = useCallback(
    (targetChapterNumber: number) => {
      const filtered = chapters.filter(
        (ch: any) => ch.chapterNumber !== targetChapterNumber,
      );
      const updated = filtered.map((ch: any, idx: number) => ({
        ...ch,
        chapterNumber: idx + 1,
      }));
      let next = selectedChapterNumber;
      if (targetChapterNumber === selectedChapterNumber)
        next = Math.max(1, targetChapterNumber - 1);
      else if (targetChapterNumber < selectedChapterNumber)
        next = selectedChapterNumber - 1;
      setState({
        ...state,
        selectedChapterNumber: next,
        book: { ...state.book, chapters: updated },
      });
    },
    [chapters, selectedChapterNumber, state],
  );

  const handleReorderChapters = useCallback(
    (oldIndex: number, newIndex: number) => {
      const reordered = arrayMove(chapters, oldIndex, newIndex);
      setState({ ...state, book: { ...state.book, chapters: reordered } });
    },
    [chapters, state],
  );

  // ✅ No CopilotKit setState on every keystroke
  const handleContentChange = useCallback(
    (val: string) => {
      const target = selectedChapterNumber;
      contentRef.current[target] = val;
      setLocalChapters((prev) =>
        prev.map((ch) =>
          Number(ch.chapterNumber) === Number(target)
            ? { ...ch, content: val }
            : ch,
        ),
      );
    },
    [selectedChapterNumber],
  );

  const handleGenerateChapterContent = useCallback(
    async (chapterNumber?: number) => {
      const target = chapterNumber || selectedChapterNumber;
      const chapter = chapters.find(
        (ch: Chapter) => ch.chapterNumber === target,
      );
      if (!chapter || isRunning) return;
      sendMessage(
        `Please write detailed content for Chapter ${target}: ${chapter.title}.\nContext: ${chapter.description}`,
      );
    },
    [chapters, selectedChapterNumber, isRunning, agent, copilotkit],
  );

  const handleSaveChanges = async () => {
    setIsSavingAll(true);
    try {
      const patches: Promise<Response>[] = [];
      const newChapters: any[] = [];

      chapters.forEach((ch: any) => {
        if (ch.id) {
          patches.push(
            apiFetch(`/api/chapters/${ch.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: ch.title,
                content: ch.content,
                chapterNumber: ch.chapterNumber,
                description: ch.description,
              }),
            }),
          );
        } else {
          if (!actualBookId) return;
          newChapters.push({
            bookId: actualBookId,
            title: ch.title || "New Chapter",
            description: ch.description || "",
            content: ch.content || "",
            chapterNumber: ch.chapterNumber,
          });
        }
      });

      if (newChapters.length > 0) {
        const res = await apiFetch("/api/chapters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapters: newChapters }),
        });
        if (!res.ok) {
          alert("Failed to save new chapters!");
          return;
        }
      }

      if (patches.length > 0) {
        const results = await Promise.all(patches);
        if (results.find((r) => !r.ok)) {
          alert("Failed to save some chapters!");
          return;
        }
      }
      alert("Saved successfully!");
      await refreshChapters();
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") return;
      console.error("Save failed:", err);
      alert("Connection error while saving!");
    } finally {
      setIsSavingAll(false);
    }
  };

  useLangGraphInterrupt({
    agentId: "dashboard",
    enabled: ({ eventValue }) => eventValue?.type === "edit_approval",
    render: ({ event, resolve }) => {
      const { chapter, old_text, new_text } = event.value;
      return (
        <EditApprovalCard
          chapter={chapter}
          old_text={old_text}
          new_text={new_text}
          onApprove={() => resolve("yes")}
          onReject={() => resolve("no")}
        />
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-sidebar-primary-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
          <p className="text-slate-500 font-medium animate-pulse">
            Loading from Database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-primary-foreground">
      <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
        {!isFullScreen && !isTabletOrMobile && (
          <>
            <ResizablePanel defaultSize={20}>
              <aside className="h-full border-r border-slate-200 bg-slate-50/30 overflow-hidden">
                <ChapterSidebar
                  chapters={chapters}
                  selectedChapterNumber={selectedChapterNumber}
                  onSelectChapter={handleSelectChapter}
                  onDeleteChapter={handleDeleteChapter}
                  onGenerateChapterContent={handleGenerateChapterContent}
                  isGenerating={isRunning}
                  onAddChapter={handleAddChapter}
                  isModifyingChapters={isModifyingChapters}
                />
              </aside>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}

        <ResizablePanel defaultSize={isFullScreen ? 100 : 80}>
          <main className="h-full flex flex-col">
            <EditorHeader
              bookId={actualBookId}
              mode={mode}
              zoom={zoom}
              isRunning={isRunning}
              isSavingAll={isSavingAll}
              isFullScreen={isFullScreen}
              isWritingChapter={isWritingChapter}
              isThinking={isThinking}
              onModeChange={setMode}
              onZoomIn={() => setZoom((p) => Math.min(p + 10, 200))}
              onZoomOut={() => setZoom((p) => Math.max(p - 10, 50))}
              onFullScreen={() => setIsFullScreen((p) => !p)}
              onAIWrite={() => handleGenerateChapterContent()}
              onSave={handleSaveChanges}
              onOpenSidebar={() => setIsSideBar(true)}
            />

            <div className="flex-1 relative overflow-hidden bg-primary-foreground">
              <div
                className="h-full w-full"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.2s ease",
                }}
              >
                {mode === "edit" ? (
                  <ChapterEditTab
                    chapter={currentChapterContent}
                    onContentChange={handleContentChange}
                    isGenerating={isWritingChapter}
                    isFullScreen={isFullScreen}
                  />
                ) : (
                  <ChapterViewTab
                    content={currentChapterContent?.content}
                    title={currentChapterContent.title || "Untitled Chapter"}
                  />
                )}
              </div>
            </div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Mobile sidebar overlay */}
      {isOpenSideBar && isTabletOrMobile && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSideBar(false)}
          />
          <div className="relative w-80 h-full bg-primary-foreground shadow-2xl flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-primary-foreground">
              <span className="font-bold text-purple-700">Chapter List</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSideBar(false)}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto w-full">
              <ChapterSidebar
                chapters={chapters}
                selectedChapterNumber={selectedChapterNumber}
                onSelectChapter={handleSelectChapter}
                onDeleteChapter={handleDeleteChapter}
                onGenerateChapterContent={handleGenerateChapterContent}
                isGenerating={isRunning}
                onAddChapter={handleAddChapter}
                isModifyingChapters={isModifyingChapters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPage;
