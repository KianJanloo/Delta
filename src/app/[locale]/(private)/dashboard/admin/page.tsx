import AdminDashboardContent from "@/components/dashboard/admin/AdminDashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل مدیریت دلتا",
  description: "مرکز کنترل کامل برای مدیران سامانه دلتا",
};

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <AdminDashboardContent />
    </div>
  );
};

export default AdminDashboardPage;
