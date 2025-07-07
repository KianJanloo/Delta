import LayoutDashboard from '@/components/dashboard/layout/Layout';
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <LayoutDashboard>
      {children}
    </LayoutDashboard>
  );
};

export default Layout;
