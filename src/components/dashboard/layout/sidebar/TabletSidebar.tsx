/* eslint-disable */

'use client'
import React, { useCallback, useEffect, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, CreditCard, LogOut, SquaresSubtract } from 'lucide-react';
import Link from 'next/link';
import useClearPathname from '@/utils/helper/clearPathname/clearPathname';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/utils/hooks/useDirection';
import { useSession } from 'next-auth/react';
import { getProfileById } from '@/utils/service/api/profile/getProfileById';
import { routes, sellerRoutes } from '../routes/routes';

const TabletSidebar = ({
    view,
    setView,
}: {
    view: number;
    setView: React.Dispatch<React.SetStateAction<number>>;
}) => {

    const pathname = useClearPathname();
    const t = useTranslations("dashboardSidebar")
    const dir = useDirection()
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [role, setRole] = useState("");
    const footerSidebarSelect = role === "buyer"
        ? {
            title: "wallet",
            description: "noBalance",
            icon: CreditCard,
        }
        : {
            title: "newComments",
            description: "commentsCount",
            icon: SquaresSubtract,
        };

    const { data: session } = useSession() as any

    const getProfile = useCallback(async () => {
        const user = await getProfileById(session?.userInfo.id)
        setRole(user.role)
    }, [session])

    useEffect(() => {
        getProfile()
    }, [getProfile])

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

    const routeSelect = role === "seller" ? sellerRoutes : routes;

    return (
        <div
            className={`bg-subBg md:flex hidden transition-all duration-300 ease-in-out px-4 border py-8 gap-8 rounded-xl w-fit flex-col shadow-md ${view === 2
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none absolute"
                }`}
        >
            <div className="flex justify-center items-center mb-6">
                <LogOut
                    onClick={() => setView(1)}
                    className={`cursor-pointer rotate-180 hover:text-accent transition-colors ${dir === 'rtl' ? "rotate-180" : "rotate-0"} `}
                />
            </div>
            <div className="flex flex-col justify-between h-full items-center">
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
                <Link
                    className="hover:bg-subBg2 px-3 py-2 flex justify-center items-center rounded-lg"
                    href={""}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <CreditCard />
                            </TooltipTrigger>
                            <TooltipContent className="dark:bg-accent bg-subBg2 dark:accent-foreground absolute right-6 whitespace-nowrap text-foreground">
                                <p> {footerSidebarSelect.title} </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Link>
            </div>
        </div>
    )
}

export default TabletSidebar
