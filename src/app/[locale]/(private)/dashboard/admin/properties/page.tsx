import AdminPropertiesContent from "@/components/dashboard/admin/properties/AdminPropertiesContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت املاک | دلتا",
  description: "نظارت بر املاک ثبت شده، وضعیت انتشار و قیمت‌گذاری فروشندگان",
};

const AdminPropertiesPage = () => {
  return (
    <div className="space-y-6">
      <AdminPropertiesContent />
    </div>
  );
};

export default AdminPropertiesPage;

