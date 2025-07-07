/* eslint-disable */

'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MoreHorizontal, X } from 'lucide-react';
import DeltaIcon from "@/assets/images/icon.png";
import useClearPathname from '@/utils/helper/clearPathname/clearPathname';
import { useTranslations } from 'next-intl';
import { getProfileById } from '@/utils/service/api/profile/getProfileById';
import { useSession } from 'next-auth/react';
import { routes, sellerRoutes } from '../routes/routes';

const MobileSidebar = () => {

    const t = useTranslations("dashboardSidebar")
    const pathname = useClearPathname();
    const [showMore, setShowMore] = useState(false);
    const moreRef = useRef<HTMLDivElement | null>(null);

    const [role, setRole] = useState("");
    const routeSelect = role === "seller" ? sellerRoutes : routes;

    const { data: session } = useSession() as any

    const getProfile = useCallback(async () => {
        const user = await getProfileById(session?.userInfo.id)
        setRole(user.role)
    }, [session])

    useEffect(() => {
        getProfile()
    }, [getProfile])  

    const mainRoutes = routeSelect.slice(0, 4);
    const extraRoutes = routeSelect.slice(4);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setShowMore(false);
            }
        };
        if (showMore) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMore]);

    return (
        <div
            className={`w-dvw fixed bottom-0 right-0 z-50 justify-around items-center bg-subBg border-t py-3 md:hidden flex`}
        >
            {mainRoutes.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;
                return (
                    <Link key={href} href={href} className="flex flex-col items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Icon
                                        className={`w-6 h-6 ${isActive ? "text-primary" : ""}`}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="dark:bg-accent bg-subBg2 dark:accent-foreground text-foreground">
                                    <p> {t(label)} </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Link>
                );
            })}

            {extraRoutes.length > 0 && (
                <div className="relative" ref={moreRef}>
                    <button
                        onClick={() => setShowMore((prev) => !prev)}
                        className="flex flex-col items-center"
                    >
                        <MoreHorizontal className="w-6 h-6" />
                    </button>
                    {showMore && (
                        <div className="absolute px-2 py-2 bottom-12 left-0 bg-subBg shadow-xl rounded-lg z-50 flex flex-col gap-2 w-max min-w-[160px]">
                            <button
                                onClick={() => setShowMore(false)}
                                className="self-end mb-2"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {extraRoutes.map(({ href, label, icon: Icon, children }) => {
                                const isActive = pathname === href;

                                return children ? (
                                    children.map(({ href, label, icon: Icon }) => {
                                        const isActive = pathname === href;

                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                className={`flex items-center gap-2 px-2 py-1 flex-nowrap whitespace-nowrap rounded-md text-sm ${isActive
                                                    ? "bg-accent text-accent-foreground"
                                                    : "hover:bg-subBg2"
                                                    }`}
                                                onClick={() => setShowMore(false)}
                                            >
                                                <Icon className="min-w-4 min-h-4 h-4 w-4" />
                                                <span>{t(label)}</span>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-2 px-2 py-1 flex-nowrap whitespace-nowrap rounded-md text-sm ${isActive
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-subBg2"
                                            }`}
                                        onClick={() => setShowMore(false)}
                                    >
                                        <Icon className="min-w-4 min-h-4 h-4 w-4" />
                                        <span>{t(label)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <Link href="/" className="text-foreground flex items-center justify-center">
                <Image
                    src={DeltaIcon}
                    alt="Delta Logo"
                    width={50}
                    height={50}
                    className="w-auto h-auto max-h-[45px] md:max-h-[40px] lg:max-h-[50px] text-foreground filter invert-0 dark:invert"
                />
            </Link>
        </div>
    )
}

export default MobileSidebar
