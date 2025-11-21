import AdminCategoriesContent from "@/components/dashboard/admin/categories/AdminCategoriesContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت دسته‌بندی‌ها",
  description: "مدیریت و سازمان‌دهی دسته‌بندی‌های سامانه دلتا.",
};

const AdminCategoriesPage = () => (
  <div className="space-y-6">
    <AdminCategoriesContent />
  </div>
);

export default AdminCategoriesPage;


