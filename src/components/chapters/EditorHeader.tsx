"use client";
import { memo } from "react";
import {
  Save,
  Eye,
  Edit3,
  Share2,
  ZoomIn,
  ZoomOut,
  Minimize2,
  Maximize2,
  Sparkles,
  Menu,
  File,
  FileText,
} from "lucide-react";
import { Loader2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useExportBook } from "@/hooks/useExportBook";

interface Props {
  bookId: string;
  mode: "edit" | "view";
  zoom: number;
  isRunning: boolean;
  isSavingAll: boolean;
  isFullScreen: boolean;
  isWritingChapter?: boolean;
  isThinking?: boolean;
  onModeChange: (mode: "edit" | "view") => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullScreen: () => void;
  onAIWrite: () => void;
  onSave: () => void;
  onOpenSidebar: () => void;
}

export const EditorHeader = memo(function EditorHeader({
  bookId,
  mode,
  zoom,
  isRunning,
  isSavingAll,
  isFullScreen,
  onModeChange,
  onZoomIn,
  onZoomOut,
  onFullScreen,
  onAIWrite,
  onSave,
  onOpenSidebar,
  isThinking,
  isWritingChapter,
}: Props) {
  const { isExporting, handleExport } = useExportBook(bookId);
  return (
    <header className="h-14 flex items-center justify-between p-1.25 bg-primary-foreground border-b">
      {/* Desktop */}
      <div className="hidden lg:flex items-center gap-4">
        <Tabs
          value={mode}
          onValueChange={(v) => onModeChange(v as any)}
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
          onClick={onZoomOut}
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
          onClick={onZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden lg:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
          disabled={isRunning}
          onClick={onAIWrite}
        >
          {isWritingChapter
            ? "Writing..."
            : isThinking
              ? "Thinking..."
              : "AI Write"}
        </Button>
        <Button variant="ghost" size="icon" onClick={onFullScreen}>
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              <FileText className="mr-2 h-4 w-4 text-red-500" /> Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("doc")}>
              <File className="mr-2 h-4 w-4 text-blue-500" /> Export Word
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size="sm"
          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs shadow-md"
          onClick={onSave}
        >
          {isSavingAll ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSavingAll ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Mobile dropdown */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 border">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onModeChange("edit")}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModeChange("view")}>
                <Eye className="mr-2 h-4 w-4" /> View Mode
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Zoom: {zoom}%</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onZoomIn}>
                <ZoomIn className="mr-2 h-4 w-4" /> Zoom In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onZoomOut}>
                <ZoomOut className="mr-2 h-4 w-4" /> Zoom Out
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled={isRunning} onClick={onAIWrite}>
                {isRunning ? (
                  <Loader2 className="mr-2 h-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4" />
                )}
                AI Generate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onFullScreen}>
                {isFullScreen ? (
                  <Minimize2 size={18} />
                ) : (
                  <Maximize2 size={18} />
                )}
                Full Screen
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 animate-spin" />
                  ) : (
                    <Share2 className="mr-2 h-4" />
                  )}
                  {isExporting ? "Exporting..." : "Export Book"}
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>
                      <FileText className="mr-2 h-4 w-4 text-red-500" /> PDF
                      Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("doc")}>
                      <File className="mr-2 h-4 w-4 text-blue-500" /> Word
                      Format
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={onSave}>
                {isSavingAll ? (
                  <Loader2 className="mr-2 h-4 animate-spin" />
                ) : (
                  <Save className="h-4 mr-2" />
                )}
                {isSavingAll ? "Saving..." : "Save"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenSidebar}>
              <Menu size={20} /> ChaptersSideBar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});
