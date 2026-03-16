"use client";
import { useState, useCallback } from "react";
import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CalendarIcon, Trash2, Pencil, Plus, Check, X } from "lucide-react";
import { format } from "date-fns";
import { useTodoTool } from "../action-ai/useTodoTool";

type Todo = {
  id: string;
  text: string;
  checked: boolean;
  date: string;
};

const today = format(new Date(), "yyyy-MM-dd");

const DEFAULT_TODOS: Todo[] = [
  { id: "1", text: "Review Q3 sales report", checked: true, date: today },
  { id: "2", text: "Update book inventory", checked: true, date: today },
  { id: "3", text: "Reply to publisher emails", checked: true, date: today },
  { id: "4", text: "Schedule team meeting", checked: false, date: today },
  {
    id: "5",
    text: "Review new manuscript submissions",
    checked: false,
    date: today,
  },
  { id: "6", text: "Update pricing for Q4", checked: false, date: today },
];

const Todolist = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [todos, setTodos] = useState<Todo[]>(DEFAULT_TODOS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");
  const [showInput, setShowInput] = useState(false);

  const selectedDate = format(date, "yyyy-MM-dd");
  const filtered = todos.filter((t) => t.date === selectedDate);
  const done = filtered.filter((t) => t.checked).length;

  const handleAction = useCallback(
    (action: any) => {
      if (action.action === "add" && action.text) {
        setTodos((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: action.text,
            checked: false,
            date: action.date ?? selectedDate,
          },
        ]);
      } else if (action.action === "delete" && action.id) {
        setTodos((prev) => prev.filter((t) => t.id !== action.id));
      } else if (action.action === "edit" && action.id && action.text) {
        setTodos((prev) =>
          prev.map((t) =>
            t.id === action.id ? { ...t, text: action.text } : t,
          ),
        );
      } else if (action.action === "toggle" && action.id) {
        setTodos((prev) =>
          prev.map((t) =>
            t.id === action.id ? { ...t, checked: !t.checked } : t,
          ),
        );
      }
    },
    [selectedDate],
  );

  useTodoTool(handleAction);

  return (
    <div className="border shadow-sm p-4 rounded-2xl h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-medium">Todo List</h1>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
          {done}/{filtered.length} done
        </span>
      </div>

      {/* Date picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full mb-4">
            <CalendarIcon className="mr-2 w-4 h-4" />
            {format(date, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                setDate(d);
                setOpen(false);
              }
            }}
            className="rounded-lg border"
            required
          />
        </PopoverContent>
      </Popover>

      {/* Todo list */}
      <ScrollArea className="flex-1 h-[320px]">
        <div className="flex flex-col gap-2 pr-2">
          {filtered.length === 0 && !showInput && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Không có todo nào cho ngày này
            </p>
          )}

          {filtered.map((todo) => (
            <Card key={todo.id} className="p-3 group">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={todo.checked}
                  onCheckedChange={() =>
                    handleAction({ action: "toggle", id: todo.id })
                  }
                />
                {editingId === todo.id ? (
                  <div className="flex flex-1 gap-1.5 items-center">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="h-7 text-sm flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && editText.trim()) {
                          handleAction({
                            action: "edit",
                            id: todo.id,
                            text: editText.trim(),
                          });
                          setEditingId(null);
                        }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button
                      onClick={() => {
                        if (editText.trim()) {
                          handleAction({
                            action: "edit",
                            id: todo.id,
                            text: editText.trim(),
                          });
                        }
                        setEditingId(null);
                      }}
                      className="text-green-500 hover:text-green-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 text-sm leading-snug ${todo.checked ? "line-through text-muted-foreground" : ""}`}
                    >
                      {todo.text}
                    </span>
                    {/* Actions — hiện khi hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditText(todo.text);
                        }}
                        className="p-1 rounded hover:bg-muted"
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-blue-500" />
                      </button>
                      <button
                        onClick={() =>
                          handleAction({ action: "delete", id: todo.id })
                        }
                        className="p-1 rounded hover:bg-muted"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}

          {/* Add input */}
          {showInput && (
            <Card className="p-3">
              <div className="flex gap-1.5 items-center">
                <Input
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Nhập nội dung todo..."
                  className="h-7 text-sm flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newText.trim()) {
                      handleAction({
                        action: "add",
                        text: newText.trim(),
                        date: selectedDate,
                      });
                      setNewText("");
                      setShowInput(false);
                    }
                    if (e.key === "Escape") {
                      setNewText("");
                      setShowInput(false);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newText.trim()) {
                      handleAction({
                        action: "add",
                        text: newText.trim(),
                        date: selectedDate,
                      });
                      setNewText("");
                    }
                    setShowInput(false);
                  }}
                  className="text-green-500 hover:text-green-600"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setNewText("");
                    setShowInput(false);
                  }}
                  className="text-red-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
          )}

          {/* Add button */}
          {!showInput && (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-muted transition-colors w-full"
            >
              <Plus className="w-4 h-4" />
              Thêm todo
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Todolist;
