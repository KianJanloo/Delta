'use client'
import React, { useCallback, useEffect, useMemo } from 'react'
import SidebarDashboard from './sidebar/SidebarDashboard';
import HeaderDashboard from './header/HeaderDashboard';
import { useDirection } from '@/utils/hooks/useDirection';
import useClearPathname from '@/utils/helper/clearPathname/clearPathname';
import { useRouter } from 'next/navigation';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    
    type PanelKey = "admin" | "seller" | "buyer";

    const [view, setView] = React.useState(1);
    const dir = useDirection()
    const pathname = useClearPathname();
    const router = useRouter();

    const currentPanel = useMemo<PanelKey>(() => {
        if (pathname.startsWith("/dashboard/admin")) return "admin";
        if (pathname.startsWith("/dashboard/seller")) return "seller";
        return "buyer";
    }, [pathname]);

    const [activePanel, setActivePanel] = React.useState<PanelKey>(currentPanel);

    useEffect(() => {
        setActivePanel(currentPanel);
    }, [currentPanel]);

    const handlePanelChange = useCallback((panel: PanelKey) => {
        setActivePanel(panel);
        const targetHref =
            panel === "admin"
                ? "/dashboard/admin"
                : panel === "seller"
                    ? "/dashboard/seller"
                    : "/dashboard";
        if (pathname !== targetHref) {
            router.push(targetHref);
        }
    }, [pathname, router]);

    const desktopDirection = dir === "rtl" ? "md:flex-row" : "md:flex-row-reverse";

    return (
        <div className={`bg-bgDash min-h-dvh h-dvh w-full overflow-hidden p-3 sm:p-4 gap-5 flex flex-col ${desktopDirection}`}>
            <div className="md:h-full md:flex md:flex-col md:justify-between">
                <SidebarDashboard
                    view={view}
                    setView={setView}
                    activePanel={activePanel}
                />
            </div>

            <div className="w-full flex flex-1 flex-col gap-5 min-h-0">
                <HeaderDashboard
                    activePanel={activePanel}
                    onPanelChange={handlePanelChange}
                />

                <div className="flex-1 min-h-0 max-md:mb-[64px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
