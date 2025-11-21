import AdminSocialMediaLinksContent from "@/components/dashboard/admin/social-media/AdminSocialMediaLinksContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شبکه‌های اجتماعی دلتا",
  description: "مدیریت لینک‌های شبکه‌های اجتماعی دلتا در پنل مدیریت.",
};

const AdminSocialMediasPage = () => (
  <div className="space-y-6">
    <AdminSocialMediaLinksContent />
  </div>
);

export default AdminSocialMediasPage;


