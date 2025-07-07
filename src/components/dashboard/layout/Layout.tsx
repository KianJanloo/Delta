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

    return (
        <div className={`bg-bgDash h-dvh p-4 gap-5 flex ${dir === "rtl" ? "flex-row" : "flex-row-reverse"} `}>
            <SidebarDashboard view={view} setView={setView} />

            <div className={`w-full max-xl:w-full flex flex-col gap-5`}>
                <HeaderDashboard />

                <div className="flex-1 max-md:mb-[50px] overflow-y-auto pr-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
