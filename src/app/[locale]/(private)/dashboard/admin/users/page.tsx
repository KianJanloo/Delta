import AdminUsersContent from "@/components/dashboard/admin/users/AdminUsersContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت کاربران | دلتا",
  description: "کنترل کامل بر کاربران سامانه دلتا، نقش‌ها و وضعیت فعالیت آن‌ها",
};

const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <AdminUsersContent />
    </div>
  );
};

export default AdminUsersPage;

