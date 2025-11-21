import { Metadata } from "next";
import AdminChatsContent from "@/components/dashboard/admin/chats/AdminChatsContent";

export const metadata: Metadata = {
  title: "مدیریت گفتگوها",
  description: "نظارت و مدیریت کامل گفتگوهای کاربران در سامانه دلتا",
};

const AdminChatsPage = () => {
  return (
    <div className="space-y-6">
      <AdminChatsContent />
    </div>
  );
};

export default AdminChatsPage;


