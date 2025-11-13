import AdminContactMessagesContent from "@/components/dashboard/admin/contact-us/AdminContactMessagesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پیام‌های تماس با ما | پنل مدیریت",
  description: "مدیریت پیام‌های ارسال‌شده از صفحه تماس با ما در پنل مدیریت دلتا.",
};

const AdminContactUsPage = () => (
  <div className="space-y-6">
    <AdminContactMessagesContent />
  </div>
);

export default AdminContactUsPage;

