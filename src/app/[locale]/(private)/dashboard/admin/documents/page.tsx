import AdminDocumentsContent from "@/components/dashboard/admin/documents/AdminDocumentsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت مدارک | دلتا",
  description: "بازبینی و تایید مدارک کاربران و املاک در پنل مدیریت دلتا.",
};

const AdminDocumentsPage = () => {
  return (
    <div className="space-y-6">
      <AdminDocumentsContent />
    </div>
  );
};

export default AdminDocumentsPage;


