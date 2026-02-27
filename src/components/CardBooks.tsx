"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BookRow } from "./RowBook";
import { ScrollArea } from "./ui/scroll-area";
import DialogBook from "./DialogBook";

interface AddBook {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  description?: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function CardBooks() {
  return (
    <Card>
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Book Library</h2>
          <DialogBook />
        </CardTitle>
      </CardHeader>
      {/* Content */}
      <ScrollArea className="max-h-[505px] mt-4 overflow-y-auto">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BookRow
            image="/yuzuha.png"
            title="Book Title"
            author="Author Name"
            star={10}
            status="DRAFT"
            onDelete={() => {}}
            onEdit={() => {}}
          />
          <BookRow
            image="/yuzuha.png"
            title="Book Title"
            author="Author Name"
            star={10}
            status="DRAFT"
            onDelete={() => {}}
            onEdit={() => {}}
          />
          <BookRow
            image="/yuzuha.png"
            title="Book Title"
            author="Author Name"
            star={10}
            status="DRAFT"
            onDelete={() => {}}
            onEdit={() => {}}
          />

          <BookRow
            image="/yuzuha.png"
            title="Book Title"
            author="Author Name"
            star={10}
            status="DRAFT"
            onDelete={() => {}}
            onEdit={() => {}}
          />
          <BookRow
            image="/yuzuha.png"
            title="Book Title"
            author="Author Name"
            star={10}
            status="DRAFT"
            onDelete={() => {}}
            onEdit={() => {}}
          />
          <BookRow
            image="/yuzuha.png"
            title="Book Title"
            author="Author Name"
            star={10}
            status="DRAFT"
            onDelete={() => {}}
            onEdit={() => {}}
          />
          <BookRow
            image="/yuzuha.png"
            title="Book Title"
            author="Author Name"
            star={10}
            status="DRAFT"
            onDelete={() => {}}
            onEdit={() => {}}
          />
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
