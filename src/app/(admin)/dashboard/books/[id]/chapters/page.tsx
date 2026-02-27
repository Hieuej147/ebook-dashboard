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
import { useCopilotChat, useDefaultTool } from "@copilotkit/react-core";
import { useLangChainAgent } from "@/app/provider/AgentContext";
import { Loader2 } from "lucide-react";
import { ChapterEditTab, ChapterViewTab } from "@/components/ChapterTab";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  chapterNumber: number;
}
const EditPage = () => {
  const { id } = useParams();
  const agent = useLangChainAgent();
  const { appendMessage } = useCopilotChat();
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [zoom, setZoom] = useState(100);
  const [isPending, startTransition] = useTransition();
  const [isOpenSideBar, setIsSideBar] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localChapters, setLocalChapters] = useState<Chapter[]>([]);
  const [localSelectedNumber, setLocalSelectedNumber] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isContent, setIsContent] = useState("");
  const [isTabletOrMobile, setisTabletOrMobile] = useState(false);
  useDefaultTool({
    render: ({ name, status }) => {
      const textStyles = "text-gray-500 text-sm mt-2";
      if (status !== "complete") {
        return <p className={textStyles}>Calling {name}...</p>;
      }
      return <p className={textStyles}>Called {name}!</p>;
    },
  });

  useEffect(() => {
    const checkMobile = () => setisTabletOrMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    async function restoreData() {
      if (!id) return;
      setIsLoading(true); // Bắt đầu load

      try {
        // Gọi song song 2 API để tối ưu tốc độ
        const [bookRes, chaptersRes] = await Promise.all([
          fetch(`/api/books/${id}`),
          fetch(`/api/chapters/${id}`),
        ]);

        if (!bookRes.ok || !chaptersRes.ok) throw new Error("API Error");

        const bookData = await bookRes.json();
        const chaptersData = await chaptersRes.json();

        console.log("Check data reload:", { bookData, chaptersData });
        setLocalChapters(chaptersData);
        setLocalSelectedNumber(1);
        agent.setState({
          ...agent.state,
          book: {
            title: bookData.title,
            topic: bookData.subtitle || bookData.topic || "",
            author: bookData.author,
            chapters: chaptersData,
          },
          selectedChapterNumber: 1,
        });
      } catch (error) {
        console.error("Lỗi khôi phục dữ liệu:", error);
      } finally {
        setIsLoading(false); // Chắc chắn sẽ tắt Loader dù thành công hay thất bại
      }
    }

    restoreData();
  }, [id]);

  // --- OPTIMIZATION: Lấy nội dung chương hiện tại một cách trực tiếp ---
  const chapters = useMemo(() => {
    const agentChapters = agent.state.book?.chapters;
    // Nếu Agent có dữ liệu thì dùng, không thì dùng bản backup local
    return agentChapters && agentChapters.length > 0
      ? agentChapters
      : localChapters;
  }, [agent.state.book?.chapters, localChapters]);
  const currentChapterContent = useMemo(() => {
    return chapters.find(
      (ch: any) => Number(ch.chapterNumber) === Number(localSelectedNumber),
    );
  }, [chapters, localSelectedNumber]);
  useEffect(() => {
    setIsContent(currentChapterContent?.content || "");
  }, [currentChapterContent]);

  // --- HANDLERS: Xử lý sự kiện UI ---
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleSelectChapter = useCallback(
    (chapterNumber: number) => {
      setLocalSelectedNumber(chapterNumber);
      startTransition(() => {
        agent.setState({
          ...agent.state,
          selectedChapterNumber: chapterNumber,
        });
      });
      setIsSideBar(false);
    },

    [agent.setState],
  );
  const handleDeleteChapter = useCallback(
    (targetChapterNumber: number) => {
      const filtered = chapters.filter(
        (ch: any) => ch.chapterNumber !== targetChapterNumber,
      );
      const updated = filtered.map((ch: any, idx: number) => ({
        ...ch,
        chapterNumber: idx + 1,
      }));

      // Nếu xóa chương đang chọn, tự động nhảy về chương trước đó hoặc chương 1
      let nextChapterNumber = localSelectedNumber;
      if (targetChapterNumber === localSelectedNumber) {
        nextChapterNumber = Math.max(1, targetChapterNumber - 1);
      } else if (targetChapterNumber < localSelectedNumber) {
        nextChapterNumber = localSelectedNumber - 1;
      }
      agent.setState({
        ...agent.state,
        selectedChapterNumber: nextChapterNumber,
        book: { ...agent.state.book, chapters: updated },
      });
    },

    [chapters, localSelectedNumber, agent],
  );
  const handleReorderChapters = useCallback(
    (oldIndex: number, newIndex: number) => {
      const newArray = arrayMove(chapters, oldIndex, newIndex);
      agent.setState({
        ...agent.state,
        book: { ...agent.state.book, chapters: newArray },
      });
    },
    [chapters, agent.state, agent.setState],
  );
  const handleContentChange = useCallback(
    (val: string) => {
      // LUÔN dùng localSelectedNumber ở đây để đảm bảo lưu đúng chương đang gõ
      const targetNumber = localSelectedNumber;

      setLocalChapters((prev) => {
        const newArr = [...prev];
        const idx = newArr.findIndex(
          (ch) => Number(ch.chapterNumber) === Number(targetNumber),
        );
        if (idx !== -1) newArr[idx] = { ...newArr[idx], content: val };
        return newArr;
      });

      // Sync với Agent để AI Assistant không bị "tối cổ"
      agent.setState({
        ...agent.state,
        book: {
          ...agent.state.book,
          chapters: chapters.map((ch: any) =>
            Number(ch.chapterNumber) === Number(targetNumber)
              ? { ...ch, content: val }
              : ch,
          ),
        },
      });
    },
    [localSelectedNumber, chapters, agent],
  );
  const handleSaveChanges = async () => {
    setIsSavingAll(true);
    try {
      const updatePromises = chapters.map((chapter: any) => {
        // Gọi tới Proxy Route: /api/chapters/[id]
        return fetch(`/api/chapters/${chapter.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: chapter.title,
            content: chapter.content,
            chapterNumber: chapter.chapterNumber,
            description: chapter.description,
          }),
        });
      });

      await Promise.all(updatePromises);
      alert("Saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSavingAll(false);
    }
  };
  const handleUploadImage = async () => {};
  const handleGenerateOutline = async () => {};
  const handleGenerateChapterContent = useCallback(
    async (chapterNumber?: number) => {
      // 1. Kiểm tra: Nếu có truyền chapterNumber (từ Sidebar) thì lấy số đó.
      // Nếu không (từ Editor/Header) thì lấy localSelectedNumber hiện tại.
      const targetNumber = chapterNumber || localSelectedNumber;

      // 2. Tìm đúng data của chương đó để lấy Title/Description gửi cho AI
      const targetChapter = chapters.find(
        (ch: Chapter) => ch.chapterNumber === targetNumber,
      );

      if (!targetChapter || agent.isRunning) return;

      appendMessage(
        new TextMessage({
          content: `Please write detailed content for Chapter ${targetNumber}: ${targetChapter.title}. 
                Context: ${targetChapter.description}`,
          role: Role.User,
        }),
      );
    },
    [chapters, localSelectedNumber, agent.isRunning],
  );
  const handleExportPDF = async () => {};
  const handleExportDoc = async () => {};
  const handleAddchapter = async () => {};
  // Dùng isLoading để chặn thay vì agent.state.book
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
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
    <div className="h-screen w-full flex flex-col bg-white">
      <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
        {/* --- SIDEBAR CẤP 2 (DESKTOP) --- */}
        {/* Hiện luôn bên trái để bạn dễ test */}
        {!isFullScreen && !isTabletOrMobile && (
          <>
            <ResizablePanel defaultSize={20}>
              <aside className="h-full border-r border-slate-200 bg-slate-50/30 overflow-hidden">
                <ChapterSidebar
                  chapters={chapters}
                  selectedChapterNumber={localSelectedNumber}
                  onSelectChapter={handleSelectChapter}
                  onReorderChapters={handleReorderChapters}
                  onDeleteChapter={handleDeleteChapter}
                  onGenerateChapterContent={handleGenerateChapterContent}
                  isGenerating={agent.isRunning}
                  onAddChapter={() => {}}
                />
              </aside>
            </ResizablePanel>
            <ResizableHandle withHandle defaultValue={300} />
          </>
        )}
        <ResizablePanel defaultSize={isFullScreen ? 100 : 80}>
          <main className="h-full flex flex-col">
            <header className="h-14 flex items-center justify-between p-1.25 bg-white border-b">
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
                {/* Nút AI để viết nội dung chương */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={agent.isRunning}
                  onClick={() => handleGenerateChapterContent()}
                >
                  {agent.isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  AI Write
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullScreen!(!isFullScreen)}
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
                      {/* Chế độ xem */}
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
                        disabled={agent.isRunning}
                        onClick={() => handleGenerateChapterContent()}
                      >
                        {agent.isRunning ? (
                          <Loader2 className="mr-2 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4" />
                        )}
                        <span>AI Generate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setIsFullScreen!(!isFullScreen)}
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
            {/**Vung soan thao */}
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
                    onGenerateChapterContent={handleGenerateChapterContent}
                    isGenerating={agent.isRunning}
                    isFullScreen={isFullScreen}
                  />
                ) : (
                  <ChapterViewTab
                    content={isContent}
                    title={
                      currentChapterContent?.title || "Chương chưa có tiêu đề"
                    }
                  />
                )}
              </div>
            </div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* --- SIDEBAR CẤP 2 (MOBILE DRAWER) --- */}
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
                selectedChapterNumber={localSelectedNumber}
                onSelectChapter={handleSelectChapter}
                onReorderChapters={handleReorderChapters}
                onDeleteChapter={handleDeleteChapter}
                onGenerateChapterContent={handleGenerateChapterContent}
                isGenerating={agent.isRunning}
                onAddChapter={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPage;
