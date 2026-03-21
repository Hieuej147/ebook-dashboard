"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookSchema, UpdateBookInput } from "@/lib/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useCallback, useEffect, useState } from "react";
import { ImageIcon, Loader2, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form } from "../ui/form";

interface Category {
  id: string;
  name: string;
}
interface DataBook {
  id: string | null;
  open: boolean;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditBookID({
  id,
  open,
  categories,
  onOpenChange,
  onSuccess,
}: DataBook) {
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<UpdateBookInput>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      categoryId: "",
      title: "",
      author: "",
      price: 0,
      stock: 0,
      sku: "",
      category: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (id && open) {
      const fetchData = async () => {
        setIsFetching(true);
        try {
          const res = await fetch(`/api/books/${id}`);
          const data = await res.json();
          const foundcategory = categories.find(
            (c) => c.name === data.category,
          );
          const formatData = {
            ...data,
            categoryId: foundcategory?.id || "",
          };
          // Reset form with data from API
          form.reset(formatData);
        } catch (error) {
          console.error("Error loading book info:", error);
          toast.error("Failed to load book data.");
        } finally {
          setIsFetching(false);
        }
      };
      fetchData();
    }
  }, [id, open, form, categories]);

  const onSubmit = async (values: UpdateBookInput) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append text/number fields to FormData
      formData.append("title", values.title);
      formData.append("author", values.author);
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("status", values.status);
      formData.append("isActive", String(values.isActive));
      formData.append("categoryId", values.categoryId);

      // Handle file: imageUrl contains the File object from the input
      if (values.imageUrl instanceof File) {
        formData.append("image", values.imageUrl);
      }

      const response = await fetch(`/api/books/${id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        onSuccess();
        onOpenChange(false);
        toast.success("Update successful!");
      } else {
        toast.error(`Update Failed: ${data.message}`);
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChapters = useCallback(() => {
    router.push(`/dashboard/books/${id}/chapters`);
  }, [id]);

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="sm:max-w-xl overflow-y-auto p-4">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Edit Book</SheetTitle>
          <SheetDescription>
            Update the detailed information for your book.
          </SheetDescription>
        </SheetHeader>

        {isFetching ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <Form {...form}>
            <form
              id="edit-book-form"
              className="space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="space-y-4">
                {/* ROW 1: METADATA (ID & SKU) */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>System ID</FieldLabel>
                        <Input
                          {...field}
                          disabled
                          className="bg-slate-50 border-dashed"
                        />
                      </Field>
                    )}
                  />
                  <Controller
                    name="sku"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>SKU Code</FieldLabel>
                        <Input
                          {...field}
                          disabled
                          className="bg-slate-50 border-dashed"
                        />
                      </Field>
                    )}
                  />
                </div>

                {/* ROW 2: PRIMARY INFO (Title & Author) */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Book Title</FieldLabel>
                        <Input {...field} placeholder="Enter title..." />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name="author"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Author</FieldLabel>
                        <Input {...field} placeholder="Enter author name..." />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>

                {/* ROW 3: CATEGORY (Current Name & New Select) */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Current Category</FieldLabel>
                        <Input {...field} disabled className="bg-slate-100" />
                      </Field>
                    )}
                  />
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Change Category</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select new..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cate) => (
                              <SelectItem key={cate.id} value={cate.id}>
                                {cate.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>

                {/* ROW 4: BUSINESS (Price & Stock) */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Price (VND)</FieldLabel>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name="stock"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Stock Quantity</FieldLabel>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>

                {/* ROW 5: STATUS & ACTIVE */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Publishing Status</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">DRAFT</SelectItem>
                            <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                  <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Enable Sales</FieldLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(val) =>
                            field.onChange(val === "true")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">
                              Available (True)
                            </SelectItem>
                            <SelectItem value="false">
                              Hidden (False)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="imageUrl"
                  control={form.control}
                  render={({
                    field: { onChange, value, ...field },
                    fieldState,
                  }) => {
                    const previewUrl =
                      value instanceof File
                        ? URL.createObjectURL(value)
                        : typeof value === "string"
                          ? value
                          : null;

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="flex items-center gap-2">
                          Book Cover Image{" "}
                          <ImageIcon size={14} className="text-slate-400" />
                        </FieldLabel>

                        <div className="flex items-end gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            className="flex-1 cursor-pointer"
                            {...field}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                          />

                          {/* HOVER EFFECT FOR IMAGE PREVIEW */}
                          {previewUrl && (
                            <HoverCard openDelay={200} closeDelay={100}>
                              <HoverCardTrigger asChild>
                                <div className="relative group cursor-zoom-in">
                                  <img
                                    src={previewUrl}
                                    alt="Current cover"
                                    className="h-11 w-8 object-cover rounded shadow-sm border group-hover:opacity-80 transition-opacity"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn
                                      size={12}
                                      className="text-white bg-black/50 rounded-full p-0.5"
                                    />
                                  </div>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent
                                side="top"
                                align="end"
                                className="w-64 p-0 overflow-hidden border-none shadow-2xl"
                              >
                                <div className="relative aspect-3/4">
                                  <img
                                    src={previewUrl}
                                    alt="Large preview"
                                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-200"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent">
                                    <p className="text-[10px] text-white font-medium">
                                      Cover Preview
                                    </p>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </Form>
        )}
        <SheetFooter className="mt-8 flex-col gap-3 sm:flex-col">
          <Button
            type="submit"
            form="edit-book-form"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleEditChapters}
              className="w-full"
            >
              Edit Chapters
            </Button>
            <SheetClose asChild>
              <Button variant="secondary" className="w-full">
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
