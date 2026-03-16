"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export function DraggableCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : "auto",
      }}
      className="relative h-full"
    >
      {/* Handle kéo */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 z-10 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      {children}
    </div>
  );
}
