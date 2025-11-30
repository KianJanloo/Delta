"use client"
import React, { useEffect, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import useClearPathname from '@/utils/helper/clearPathname/clearPathname';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/utils/hooks/useDirection';
import { routes, sellerRoutes, adminRoutes } from '../routes/routes';

type PanelKey = "admin" | "seller" | "buyer";

const TabletSidebar = ({
    view,
    setView,
    activePanel,
}: {
    view: number;
    setView: React.Dispatch<React.SetStateAction<number>>;
    activePanel: PanelKey;
}) => {

    const pathname = useClearPathname();
    const t = useTranslations("dashboardSidebar")
    const dir = useDirection()
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const checkScreenWidth = () => {
            if (window.innerWidth < 1200) {
                setView(2);
            }
        };

        checkScreenWidth();

        window.addEventListener("resize", checkScreenWidth);

        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, [setView]);

    const routeSelect = activePanel === "admin" ? adminRoutes : activePanel === "seller" ? sellerRoutes : routes;

    return (
        <div
            className={`bg-subBg md:flex hidden transition-all duration-300 ease-in-out px-4 border py-8 gap-8 rounded-xl w-fit flex-col shadow-md max-h-[calc(100vh-2rem)] overflow-hidden ${view === 2
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none absolute"
                }`}
        >
            <div className="flex justify-center items-center mb-6 shrink-0">
                <LogOut
                    onClick={() => setView(1)}
                    className={`cursor-pointer rotate-180 hover:text-accent transition-colors ${dir === 'rtl' ? "rotate-180" : "rotate-0"} `}
                />
            </div>
            <div className="flex flex-col h-full items-center overflow-y-auto pr-1">
                <div className="flex flex-col gap-2">
                    {routeSelect.map(({ label, href, icon: Icon, children }) => {
                        const isActive = pathname === href;
                        const isDropdownOpen = openDropdown === href;

                        const handleClick = (e: React.MouseEvent) => {
                            if (children) {
                                e.preventDefault();
                                setOpenDropdown((prev) => (prev === href ? null : href));
                            }
                        };

                        return (
                            <div className="flex flex-col" key={href}>
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={handleClick}
                                    className={`whitespace-nowrap flex gap-3 items-center px-3 py-2 rounded-lg font-medium transition-colors ${isActive
                                        ? "dark:bg-accent dark:text-accent-foreground bg-subBg2"
                                        : "hover:bg-subBg2 bg-none"
                                        }`}
                                >
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="flex flex-col items-center">
                                                <Icon className="w-5 h-5 min-w-5 min-h-5" />
                                                {children && (
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                )}
                                            </TooltipTrigger>
                                            <TooltipContent className="dark:bg-accent bg-subBg2 dark:accent-foreground absolute right-6 whitespace-nowrap text-foreground">
                                                <p> {t(label)} </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Link>
                                {isDropdownOpen && children && (
                                    <div className=" flex flex-col gap-2 mt-1">
                                        {children.map(({ label, href, icon: Icon }) => {
                                            const isActive = pathname === href;

                                            return (
                                                <Link
                                                    key={href}
                                                    href={href}
                                                    className={`whitespace-nowrap flex justify-between items-center px-3 py-2 rounded-lg font-medium transition-colors ${isActive
                                                        ? "dark:bg-accent dark:text-accent-foreground bg-subBg2"
                                                        : "hover:bg-subBg2 bg-none"
                                                        }`}
                                                >
                                                    <div className="flex gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger className="flex flex-col items-center">
                                                                    <Icon className="w-5 h-5 min-w-5 min-h-5" />
                                                                </TooltipTrigger>
                                                                <TooltipContent className="dark:bg-accent bg-subBg2 dark:accent-foreground absolute right-6 whitespace-nowrap text-foreground">
                                                                    <p> {t(label)} </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default TabletSidebar
