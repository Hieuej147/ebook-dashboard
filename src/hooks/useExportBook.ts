import { useState } from "react";

export function useExportBook(bookId: string) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "doc" | "pdf") => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/export/${bookId}/${format}`, { method: "GET" });

      const disposition = response.headers.get("Content-Disposition");
      let filename = `book.${format === "doc" ? "docx" : "pdf"}`;
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, "");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message); // Thay bằng Toast nếu có
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, handleExport };
}