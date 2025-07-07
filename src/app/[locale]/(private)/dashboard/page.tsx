import ContentDashboard from "@/components/dashboard/layout/content/ContentDashboard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: " داشبورد ",
  keywords: [" اطلاعات کاربری ", " مدیریت رزرو ها ", " لیست پرداختی ها "]
};

const Dashboard = () => {
  return (
    <div className="">
      <ContentDashboard />
    </div>
  );
};

export default Dashboard;
