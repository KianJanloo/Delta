import AdminContentManager from "@/components/dashboard/admin/content/AdminContentManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت محتوا | دلتا",
  description: "کنترل اطلاعیه‌ها، بازخورد کاربران و کانال‌های ارتباطی در پنل مدیریت دلتا",
};

const AdminContentPage = () => {
  return (
    <div className="space-y-6">
      <AdminContentManager />
    </div>
  );
};

export default AdminContentPage;

