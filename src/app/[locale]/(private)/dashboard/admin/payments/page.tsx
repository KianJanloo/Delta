import AdminPaymentsContent from "@/components/dashboard/admin/payments/AdminPaymentsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت پرداخت‌ها",
  description: "ردیابی وضعیت تراکنش‌ها، تسویه‌ها و کنترل مالی کاربران",
};

const AdminPaymentsPage = () => {
  return (
    <div className="space-y-6">
      <AdminPaymentsContent />
    </div>
  );
};

export default AdminPaymentsPage;

