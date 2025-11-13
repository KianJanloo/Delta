import AdminDiscountCodesContent from "@/components/dashboard/admin/discount-codes/AdminDiscountCodesContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت کدهای تخفیف | دلتا",
  description: "ایجاد و مدیریت کدهای تخفیف فعال در پنل مدیریت دلتا.",
};

const AdminDiscountCodesPage = () => (
  <div className="space-y-6">
    <AdminDiscountCodesContent />
  </div>
);

export default AdminDiscountCodesPage;


