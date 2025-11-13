import { Metadata } from "next";
import AdminCommentsContent from "@/components/dashboard/admin/comments/AdminCommentsContent";

export const metadata: Metadata = {
  title: "مدیریت نظرات | دلتا",
  description: "نمایش و مدیریت کامل نظرات کاربران در سامانه دلتا",
};

const AdminCommentsPage = () => {
  return (
    <div className="space-y-6">
      <AdminCommentsContent />
    </div>
  );
};

export default AdminCommentsPage;


