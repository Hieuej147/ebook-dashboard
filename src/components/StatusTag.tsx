// components/admin/StatusTag.tsx
export const StatusTag = ({ status }: { status: "DRAFT" | "PUBLISHED" }) => {
  const styles = {
    DRAFT: "bg-orange-100 text-orange-600",
    PUBLISHED: "bg-emerald-100 text-emerald-600",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
};