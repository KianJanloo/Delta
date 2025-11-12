import AdminSettingsContent from "@/components/dashboard/admin/settings/AdminSettingsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تنظیمات سیستم | دلتا",
  description: "پیکربندی و مدیریت سیاست‌های کلان سامانه دلتا",
};

const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      <AdminSettingsContent />
    </div>
  );
};

export default AdminSettingsPage;

