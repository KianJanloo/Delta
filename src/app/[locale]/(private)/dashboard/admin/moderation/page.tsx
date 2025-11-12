import AdminModerationContent from "@/components/dashboard/admin/moderation/AdminModerationContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نظارت و رسیدگی | دلتا",
  description: "پایش درخواست‌ها و نظرات حساس برای مدیران دلتا",
};

const AdminModerationPage = () => {
  return (
    <div className="space-y-6">
      <AdminModerationContent />
    </div>
  );
};

export default AdminModerationPage;

