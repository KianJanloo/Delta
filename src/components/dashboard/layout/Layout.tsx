'use client'
import React from 'react'
import SidebarDashboard from './sidebar/SidebarDashboard';
import HeaderDashboard from './header/HeaderDashboard';
import { useDirection } from '@/utils/hooks/useDirection';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    
    const [view, setView] = React.useState(1);
    const dir = useDirection()

    const desktopDirection = dir === "rtl" ? "md:flex-row" : "md:flex-row-reverse";

    return (
        <div className={`bg-bgDash min-h-dvh w-full p-3 sm:p-4 gap-5 flex flex-col ${desktopDirection}`}>
            <SidebarDashboard view={view} setView={setView} />

            <div className="w-full flex flex-col gap-5">
                <HeaderDashboard />

                <div className="flex-1 max-md:mb-[64px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
