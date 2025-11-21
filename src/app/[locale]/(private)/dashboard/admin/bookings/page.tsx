import AdminBookingsContent from "@/components/dashboard/admin/bookings/AdminBookingsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت رزروها",
  description: "پیگیری وضعیت رزروهای کاربران و رسیدگی به درخواست‌های در انتظار",
};

const AdminBookingsPage = () => {
  return (
    <div className="space-y-6">
      <AdminBookingsContent />
    </div>
  );
};

export default AdminBookingsPage;

