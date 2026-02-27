import { ChevronLeft, GripVertical, Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Chapter } from "@/lib/type";
import { useRouter } from "next/navigation";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useEffect, useState } from "react";
// --- Component Item có thể kéo thả ---
interface SortTableItemProps {
  chapter: Chapter;
  selectedChapterNumber: number;
  onSelectChapter: (index: number) => void;
  onDeleteChapter: (index: number) => void;
  onGenerateChapterContent: (index: number) => void;
  isGenerating: boolean;
}
// dashboard/books/[id]/chapters/SortTableItem.tsx

const SortTableItem = memo(
  ({
    chapter,
    selectedChapterNumber,
    onSelectChapter,
    onDeleteChapter,
    onGenerateChapterContent,
    isGenerating,
  }: SortTableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: chapter.chapterNumber,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const isActive = selectedChapterNumber === chapter.chapterNumber;

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center gap-2 p-2 rounded-lg transition-colors border ${
          isActive
            ? "bg-secondary border-primary/20 shadow-sm" // Thêm chút shadow cho cảm giác mượt
            : "hover:bg-secondary/50 border-transparent"
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-primary"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <button
          onClick={() => onSelectChapter(chapter.chapterNumber)} // ChapterNumber thường bắt đầu từ 1
          className="flex-1 flex flex-col text-left min-w-0"
        >
          <span className="text-xs font-mono text-muted-foreground">
            Ch. {chapter.chapterNumber}
          </span>
          <span className="text-sm font-medium truncate w-full">
            {chapter.title}
          </span>
        </button>

        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onGenerateChapterContent(chapter.chapterNumber)}
            disabled={isGenerating}
          >
            <Wand2
              className={`h-3.5 w-3.5 ${isGenerating ? "animate-pulse text-purple-500" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => onDeleteChapter(chapter.chapterNumber)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  },
  // HÀM SO SÁNH QUAN TRỌNG NHẤT
  (prevProps, nextProps) => {
    return (
      prevProps.selectedChapterNumber === nextProps.selectedChapterNumber &&
      prevProps.isGenerating === nextProps.isGenerating &&
      prevProps.chapter.title === nextProps.chapter.title &&
      prevProps.chapter.chapterNumber === nextProps.chapter.chapterNumber
      // Chúng ta bỏ qua các hàm callback vì sẽ xử lý ở Cha bằng useCallback
    );
  },
);
// --- Component Sidebar Chính ---
interface ChapterSidebarProps {
  chapters: Chapter[];
  selectedChapterNumber: number;
  onSelectChapter: (index: number) => void;
  onReorderChapters: (oldIndex: number, newIndex: number) => void;
  onDeleteChapter: (index: number) => void;
  onGenerateChapterContent: (index: number) => Promise<void>;
  onAddChapter: () => void;
  isGenerating: boolean;
}

const ChapterSidebar = memo(
  ({
    chapters,
    selectedChapterNumber,
    onSelectChapter,
    onReorderChapters,
    onDeleteChapter,
    onAddChapter,
    onGenerateChapterContent,
    isGenerating,
  }: ChapterSidebarProps) => {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );
    const [localOrder, setLocalOrder] = useState(chapters);
    useEffect(() => {
      setLocalOrder(chapters);
    }, [chapters]);

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = localOrder.findIndex(
          (c) => c.chapterNumber === active.id,
        );
        const newIndex = localOrder.findIndex(
          (c) => c.chapterNumber === over.id,
        );

        // CHỈ THAY ĐỔI Ở ĐÂY: Update local state, không gọi props.onReorderChapters
        const updatedOrder = arrayMove(localOrder, oldIndex, newIndex);
        setLocalOrder(updatedOrder);
      }
    };

    return (
      <aside className="h-full flex flex-col bg-white overflow-hidden">
        <div className="p-2.25 border-b flex items-center gap-2 shrink-0 bg-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-bold truncate text-sm">Back to dashboard</h2>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localOrder.map((c) => c.chapterNumber)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {localOrder.map((ch, idx) => (
                    <SortTableItem
                      key={ch.chapterNumber}
                      chapter={ch}
                      selectedChapterNumber={selectedChapterNumber}
                      onSelectChapter={onSelectChapter}
                      onDeleteChapter={onDeleteChapter}
                      onGenerateChapterContent={onGenerateChapterContent}
                      isGenerating={isGenerating}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </ScrollArea>
        <div className="p-4 border-t shrink-0 bg-white">
          <Button
            variant="secondary"
            onClick={onAddChapter}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chapter
          </Button>
        </div>
      </aside>
    );
  },
);

export default ChapterSidebar;
