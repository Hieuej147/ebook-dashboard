"use client";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  Save,
  Eye,
  Edit3,
  Share2,
  ZoomIn,
  ZoomOut,
  X,
  Menu,
  Minimize2,
  Maximize2,
  Sparkles,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChapterSidebar from "@/components/ChapterSidebar";
import { arrayMove } from "@dnd-kit/sortable";
import { useCopilotChat, useLangGraphInterrupt } from "@copilotkit/react-core";
import { Loader2 } from "lucide-react";
import { ChapterEditTab, ChapterViewTab } from "@/components/ChapterTab";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import "@copilotkit/react-core/v2/styles.css";
import { useLangChainAgent } from "@/app/provider/AgentContext";

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
  const [isTabletOrMobile, setisTabletOrMobile] = useState(false);
  const [localChapters, setLocalChapters] = useState<any[]>([]);
  const [actualBookId, setActualBookId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const { state, setState, running: isRunning, nodeName } = useLangChainAgent();
  const { appendMessage } = useCopilotChat();

  const isWritingChapter = isRunning && nodeName === "write_chapter_node";
  const selectedChapterNumber = state.selectedChapterNumber || 1;

  const chapters = useMemo(() => {
    if (state.book?.chapters?.length > 0) {
      return state.book.chapters;
    }
    return localChapters;
  }, [state.book?.chapters, localChapters]);

  // const chapters = state.book?.chapters || [];

  // 2. TÌM CHƯƠNG HIỆN TẠI SIÊU NHẸ
  const currentChapterContent = useMemo(() => {
    const found = chapters.find(
      (ch: any) => Number(ch.chapterNumber) === Number(selectedChapterNumber),
    );
    return (
      found || {
        title: "",
        description: "",
        content: "",
        chapterNumber: selectedChapterNumber,
      }
    );
  }, [chapters, selectedChapterNumber]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const refreshChapters = useCallback(async () => {
    try {
      const res = await fetch(`/api/chapters/${id}`);
      if (!res.ok) throw new Error("Fetch failed");

      const chaptersData = await res.json();
      const sanitizedChapters = chaptersData.map((ch: any) => ({
        ...ch,
        description: ch.description ?? "",
        content: ch.content ?? "",
      }));
      setLocalChapters(sanitizedChapters); // ✅ Thêm dòng này
      // Cập nhật State ngầm
      setState((prevState: any) => ({
        ...prevState,
        book: {
          ...prevState.book,
          chapters: sanitizedChapters,
        },
      }));
    } catch (error) {
      console.error("Lỗi đồng bộ:", error);
    }
  }, [id, setState]);
  const handleSelectChapter = useCallback(
    (chapterNumber: number) => {
      setState({
        ...state,
        selectedChapterNumber: chapterNumber,
      });
      setIsSideBar(false);
    },
    [state],
  );

  // --- Thêm hàm này vào EditPage.tsx (Gần chỗ handleGenerateChapterContent) ---
  const handleAddChapter = useCallback(() => {
    if (isRunning) return;

    appendMessage(
      new TextMessage({
        content:
          "Please suggest and add one new chapter to the end of the book outline.",
        role: Role.User,
      }),
    );
  }, [isRunning]);

  const handleDeleteChapter = useCallback(
    (targetChapterNumber: number) => {
      const filtered = chapters.filter(
        (ch: any) => ch.chapterNumber !== targetChapterNumber,
      );
      const updated = filtered.map((ch: any, idx: number) => ({
        ...ch,
        chapterNumber: idx + 1,
      }));

      let nextChapterNumber = selectedChapterNumber;
      if (targetChapterNumber === selectedChapterNumber) {
        nextChapterNumber = Math.max(1, targetChapterNumber - 1);
      } else if (targetChapterNumber < selectedChapterNumber) {
        nextChapterNumber = selectedChapterNumber - 1;
      }
      setState({
        ...state,
        selectedChapterNumber: nextChapterNumber,
        book: { ...state.book, chapters: updated },
      });
    },
    [chapters, selectedChapterNumber, state, setState],
  );

  const handleReorderChapters = useCallback(
    (oldIndex: number, newIndex: number) => {
      const newArray = arrayMove(chapters, oldIndex, newIndex);
      setState({
        ...state,
        book: { ...state.book, chapters: newArray },
      });
    },
    [chapters, state, setState],
  );

  // 3. TỐI ƯU HÀM GÕ PHÍM BẰNG startTransition
  const handleContentChange = useCallback(
    (val: string) => {
      const targetNumber = selectedChapterNumber;

      startTransition(() => {
        setState((prevState: any) => {
          const currentChapters = prevState.book?.chapters || [];
          return {
            ...prevState,
            book: {
              ...prevState.book,
              chapters: currentChapters.map((ch: any) =>
                Number(ch.chapterNumber) === Number(targetNumber)
                  ? { ...ch, content: val }
                  : ch,
              ),
            },
          };
        });
      });
    },
    [selectedChapterNumber, setState],
  );

  const handleSaveChanges = async () => {
    setIsSavingAll(true);
    try {
      const updatePromises: Promise<Response>[] = [];
      const newChapters: any[] = [];

      // ✅ Debug
      console.log("actualBookId:", actualBookId);
      console.log("all chapters:", chapters);

      chapters.forEach((chapter: any) => {
        if (chapter.id) {
          // Chapter đã có trong DB → PATCH
          updatePromises.push(
            fetch(`/api/chapters/${chapter.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: chapter.title,
                content: chapter.content,
                chapterNumber: chapter.chapterNumber,
                description: chapter.description,
              }),
            }),
          );
        } else {
          // ✅ Chapter mới chưa có id → cần POST
          if (!actualBookId) {
            console.error("❌ actualBookId trống! Không thể lưu chương mới.");
            return;
          }
          newChapters.push({
            bookId: actualBookId,
            title: chapter.title || "Chương mới",
            description: chapter.description || "",
            content: chapter.content || "",
            chapterNumber: chapter.chapterNumber,
          });
        }
      });

      console.log("newChapters cần POST:", newChapters);

      // ✅ POST riêng, không gộp vào Promise.all với PATCH
      if (newChapters.length > 0) {
        const postRes = await fetch(`/api/chapters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapters: newChapters }),
        });

        if (!postRes.ok) {
          const err = await postRes.text();
          console.error("❌ POST chapters failed:", err);
          alert("Lưu chương mới thất bại: " + err);
          return;
        }
        console.log("✅ POST chapters thành công");
      }

      // PATCH các chương cũ
      if (updatePromises.length > 0) {
        const results = await Promise.all(updatePromises);
        const failed = results.find((r) => !r.ok);
        if (failed) {
          console.error("❌ PATCH failed:", await failed.text());
          alert("Lưu thất bại một số chương!");
          return;
        }
      }

      alert("Saved successfully!");
      await refreshChapters(); // ✅ Reload để chương mới có id từ DB
    } catch (error) {
      console.error("Save failed:", error);
      alert("Lỗi kết nối khi lưu!");
    } finally {
      setIsSavingAll(false);
    }
  };
  const handleGenerateChapterContent = useCallback(
    async (chapterNumber?: number) => {
      const targetNumber = chapterNumber || selectedChapterNumber;
      const targetChapter = chapters.find(
        (ch: Chapter) => ch.chapterNumber === targetNumber,
      );

      if (!targetChapter || isRunning) return;

      appendMessage(
        new TextMessage({
          content: `Please write detailed content for Chapter ${targetNumber}: ${targetChapter.title}. 
                Context: ${targetChapter.description}`,
          role: Role.User,
        }),
      );
    },
    [chapters, selectedChapterNumber, isRunning],
  );

  useEffect(() => {
    const checkMobile = () => setisTabletOrMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          fetch(`/api/books/${id}`),
          fetch(`/api/chapters/${id}`),
        ]);

        if (!bookRes.ok || !chaptersRes.ok) throw new Error("API Error");

        const bookData = await bookRes.json();
        const chaptersData = await chaptersRes.json();

        console.log("BookData: ", bookData);
        console.log("ChaoterData: ", chaptersData);

        setActualBookId(bookData.id);

        const sanitizedChapters = chaptersData.map((ch: any) => ({
          ...ch,
          description: ch.description ?? "",
          content: ch.content ?? "",
        }));
        setLocalChapters(sanitizedChapters);
        setState((prevState: any) => ({
          ...prevState,
          book: {
            title: bookData.title,
            topic: bookData.subtitle || bookData.topic || "",
            author: bookData.author,
            chapters: sanitizedChapters,
          },
          selectedChapterNumber: 1,
        }));
      } catch (error) {
        console.error("Lỗi khôi phục dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreData();
  }, [id]);

  useLangGraphInterrupt({
    enabled: ({ eventValue }) => eventValue?.type === "edit_approval",
    render: ({ event, resolve }) => {
      const { chapter, old_text, new_text } = event.value;
      return (
        <div className="flex flex-col gap-3 p-4 my-2 border border-purple-200 bg-purple-50/50 rounded-xl shadow-sm text-sm">
          <p className="font-bold text-purple-800">
            🤖 AI đề xuất sửa Chương {chapter}:
          </p>
          <div className="space-y-2">
            <div>
              <span className="text-xs font-semibold text-rose-600 uppercase">
                Xóa đoạn này:
              </span>
              <p className="p-2 mt-1 bg-rose-50/80 text-rose-900 line-through rounded-md border border-rose-100">
                {old_text}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase">
                Thay bằng đoạn này:
              </span>
              <p className="p-2 mt-1 bg-emerald-50/80 text-emerald-900 rounded-md border border-emerald-100">
                {new_text}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => resolve("yes")}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Check size={16} /> Đồng ý
            </button>
            <button
              onClick={() => resolve("no")}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <X size={16} /> Từ chối
            </button>
          </div>
        </div>
      );
    },
  });

  return isLoading ? (
    <div className="flex items-center justify-center h-screen bg-sidebar-primary-foreground">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading from Database...
        </p>
      </div>
    </div>
  ) : (
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
                />
              </aside>
            </ResizablePanel>
            <ResizableHandle withHandle defaultValue={300} />
          </>
        )}
        <ResizablePanel defaultSize={isFullScreen ? 100 : 80}>
          <main className="h-full flex flex-col">
            <header className="h-14 flex items-center justify-between p-1.25 bg-primary-foreground border-b">
              <div className="hidden lg:flex items-center gap-4">
                <Tabs
                  value={mode}
                  onValueChange={(v) => setMode(v as any)}
                  className="w-[160px]"
                >
                  <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger value="edit" className="text-xs">
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="view" className="text-xs">
                      View
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="hidden lg:flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-mono w-10 text-center font-bold">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className=" hidden lg:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={isRunning}
                  onClick={() => handleGenerateChapterContent()}
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  AI Write
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                >
                  {isFullScreen ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Share2 className="h-4 w-4" /> Export
                </Button>
                <Button
                  size="sm"
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs shadow-md"
                  onClick={handleSaveChanges}
                >
                  {isSavingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSavingAll ? "Saving..." : "Save"}
                </Button>
              </div>
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 border"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setMode("edit")}>
                        <Edit3 className="mr-2 h-4 w-4" />{" "}
                        <span>Edit Mode</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMode("view")}>
                        <Eye className="mr-2 h-4 w-4" /> <span>View Mode</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Zoom: {zoom}%</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={handleZoomIn}>
                        <ZoomIn className="mr-2 h-4 w-4" /> <span>Zoom In</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleZoomOut}>
                        <ZoomOut className="mr-2 h-4 w-4" />{" "}
                        <span>Zoom Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        disabled={isRunning}
                        onClick={() => handleGenerateChapterContent()}
                      >
                        {isRunning ? (
                          <Loader2 className="mr-2 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4" />
                        )}
                        <span>AI Generate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setIsFullScreen(!isFullScreen)}
                      >
                        {isFullScreen ? (
                          <Minimize2 size={18} />
                        ) : (
                          <Maximize2 size={18} />
                        )}
                        <span>Full Screen</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4" /> Export
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSaveChanges}>
                        {isSavingAll ? (
                          <Loader2 className="mr-2 h-4 animate-spin" />
                        ) : (
                          <Save className="h-4 mr-2" />
                        )}
                        {isSavingAll ? "Saving..." : "Save"}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsSideBar(true)}>
                      <Menu size={20} />
                      <span>ChaptersSideBar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <div className="flex-1 relative overflow-hidden bg-white">
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
                    title={
                      currentChapterContent.title || "Chương chưa có tiêu đề"
                    }
                  />
                )}
              </div>
            </div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
      {isOpenSideBar && isTabletOrMobile && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSideBar(false)}
          />
          <div className="relative w-80 h-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <span className="font-bold text-purple-700">Mục lục chương</span>
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPage;
