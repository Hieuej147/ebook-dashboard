import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface BookProps {
  id: string;
  image: string;
  status: "DRAFT" | "PUBLISHED";
  title: string;
  author: string;
  star: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const statusStyle = {
  PUBLISHED: "bg-green-100 text-green-600",
  DRAFT: "bg-yellow-100 text-yellow-600",
};

export function BookRow({
  id,
  image,
  status,
  star,
  title,
  author,
  onDelete,
  onEdit,
}: BookProps) {
  return (
    <div className="rounded-2xl overflow-hidden border transition duration-200 ease-in-out hover:scale-105">
      {/* Cover */}
      <div className="relative h-40 w-full mx-auto max-w-sm mt-0">
        <Image src={image} alt="book" fill className="object-cover max-w-4xl" />

        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${statusStyle[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div>
          <h2 className="font-semibold text-sm">{title}</h2>
          <p className="text-xs text-muted-foreground">By {author}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">⭐ {star}</span>

          <div className="flex gap-3">
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault(); // Chặn Link chuyển trang
                e.stopPropagation(); // Chặn sự kiện nổi bọt
                onEdit(id);
              }}
            >
              <Edit className="w-4 h-4 text-purple-500" />
            </button>
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault(); // Chặn Link chuyển trang
                e.stopPropagation(); // Chặn sự kiện nổi bọt
                onDelete(id);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
