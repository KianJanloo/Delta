import AdminLocationsContent from "@/components/dashboard/admin/locations/AdminLocationsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت موقعیت‌ها",
  description: "کنترل و بروزرسانی موقعیت‌های جغرافیایی در پنل مدیریت دلتا.",
};

const AdminLocationsPage = () => (
  <div className="space-y-6">
    <AdminLocationsContent />
  </div>
);

export default AdminLocationsPage;


