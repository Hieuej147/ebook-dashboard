"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Proposal, ProposalSection, ProposalSectionName } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

// Component phụ trợ hiển thị từng nhóm Section
function ProposalItem({
  proposalItemKey,
  proposal,
  renderSection,
  title,
}: {
  proposal: Proposal | undefined;
  proposalItemKey: ProposalSectionName;
  renderSection: (
    name: ProposalSectionName,
    title: string,
    section: ProposalSection,
  ) => React.ReactNode;
  title: string;
}) {
  const proposalItem = proposal?.[proposalItemKey] || {};

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold border-b pb-1 text-indigo-900">
        {title}
      </h3>
      {Object.entries(proposalItem).map(([key, section]) =>
        typeof section === "string"
          ? null
          : renderSection(proposalItemKey, key, section as ProposalSection),
      )}
    </div>
  );
}

export function ProposalViewer({
  proposal,
  onSubmit,
}: {
  proposal: Proposal;
  onSubmit: (approved: boolean, proposal: Proposal) => void;
}) {
  // 1. Khởi tạo state nội bộ từ dữ liệu AI gửi về
  const [reviewedProposal, setReviewedProposal] = useState<Proposal>(proposal);

  // 2. 🔥 Dùng Ref để "khóa" state:
  // Ngăn việc useEffect reset state về mặc định (chưa tick) mỗi khi AI cập nhật log ("Thinking...")
  const lastTimestamp = useRef(proposal?.timestamp);

  useEffect(() => {
    // Chỉ cập nhật state nếu đây thực sự là một Proposal MỚI hoàn toàn từ AI (dựa vào timestamp)
    if (proposal && proposal.timestamp !== lastTimestamp.current) {
      setReviewedProposal(proposal);
      lastTimestamp.current = proposal.timestamp;
    }
  }, [proposal]);

  // 3. 🔥 Cập nhật Deep Spread:
  // Tạo bản sao mới hoàn toàn cho từng cấp độ của Object để React nhận diện được thay đổi và vẽ lại dấu tick
  const handleCheckboxChange = (
    sectionType: ProposalSectionName,
    sectionKey: string,
    checked: boolean,
  ) => {
    setReviewedProposal((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [sectionType]: {
          ...prev[sectionType],
          [sectionKey]: {
            ...prev[sectionType][sectionKey],
            approved: checked, // Ghi đè trạng thái mới cho checkbox
          },
        },
      };
    });
  };

  const handleRemarksChange = (remarks: string) => {
    setReviewedProposal((prev) => (prev ? { ...prev, remarks } : prev));
  };

  const handleSubmit = useCallback(
    (approved: boolean) => {
      if (reviewedProposal) {
        onSubmit(approved, reviewedProposal);
      }
    },
    [onSubmit, reviewedProposal],
  );

  // Hàm render từng dòng checkbox
  const renderSection = (
    sectionType: ProposalSectionName,
    sectionKey: string,
    section: ProposalSection,
  ) => (
    <div
      key={`${sectionType}-${sectionKey}`}
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 mb-2"
    >
      <Checkbox
        id={`${sectionType}-${sectionKey}`}
        checked={section.approved || false}
        onCheckedChange={(checked) =>
          handleCheckboxChange(sectionType, sectionKey, checked as boolean)
        }
        className="mt-1 relative z-30" // Đảm bảo nổi lên trên để dễ click
      />
      <div
        className="grid gap-1.5 leading-none cursor-pointer w-full"
        onClick={() =>
          handleCheckboxChange(sectionType, sectionKey, !section.approved)
        }
      >
        <label
          htmlFor={`${sectionType}-${sectionKey}`}
          className="text-sm font-bold leading-none cursor-pointer text-slate-700"
        >
          {section.title}
        </label>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {section.description}
        </p>
      </div>
    </div>
  );

  // 4. Tính toán Logic cho nút bấm dựa trên State nội bộ (reviewedProposal)
  const hasApprovedAny = reviewedProposal?.sections
    ? Object.values(reviewedProposal.sections).some((s) => s.approved)
    : false;

  return (
    <Card className="w-full border-none shadow-2xl rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-b from-slate-50 to-white border-b p-6">
        <CardTitle className="text-2xl font-bold text-indigo-950">
          Duyệt dàn ý nghiên cứu
        </CardTitle>
        <CardDescription className="text-slate-600 mt-2">
          Chọn các chương bạn muốn Agent thực hiện. Agent sẽ bỏ qua các phần
          không được chọn.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <ScrollArea className="h-[55vh] pr-4">
          <div className="space-y-8">
            {/* Render các mục dàn ý */}
            <ProposalItem
              title="Cấu trúc đề xuất"
              proposalItemKey={ProposalSectionName.Sections}
              proposal={reviewedProposal}
              renderSection={renderSection}
            />

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <label
                htmlFor="remarks"
                className="text-sm font-bold text-slate-800 flex justify-between"
              >
                <span>Yêu cầu chỉnh sửa thêm</span>
                <span className="text-[10px] text-slate-400 italic font-normal uppercase">
                  Không bắt buộc
                </span>
              </label>
              <Textarea
                id="remarks"
                placeholder="Ví dụ: Viết sâu hơn về cách AI hoạt động..."
                className="min-h-[100px] bg-slate-50 border-slate-200 focus:ring-indigo-500 resize-none rounded-xl"
                onChange={(e) => handleRemarksChange(e.target.value)}
                value={reviewedProposal?.remarks || ""}
              />
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex justify-between bg-slate-50/50 border-t p-6 gap-4">
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          // Nút Reject chỉ bật khi có nhập lý do
          disabled={!reviewedProposal?.remarks?.trim()}
        >
          ❌ Từ chối & Sửa lại
        </Button>

        <Button
          onClick={() => handleSubmit(true)}
          className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
          // Nút Approve sẽ sáng lên ngay khi bạn tick ít nhất 1 ô
          disabled={!hasApprovedAny}
        >
          ✅ Duyệt & Bắt đầu viết
        </Button>
      </CardFooter>
    </Card>
  );
}
