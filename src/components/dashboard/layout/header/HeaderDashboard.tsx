/* eslint-disable */

'use client'
import { useTheme } from "@/utils/service/TanstakProvider";
import { Bell, ChevronDown, ChevronUp, LogOut, Moon, PlusCircle, Sun } from "lucide-react";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import CommonModal from "../../modal/CommonModal";
import { signOut, useSession } from 'next-auth/react'
import { handleLogout } from "@/core/logOut";
import NotifModal from "../../modal/NotifModal";
import { redirect } from "next/navigation";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import useClearPathname from "@/utils/helper/clearPathname/clearPathname";
import LanguageSwitcher from "@/components/common/header/sections/LangSwitcher";
import LangModal from "../../modal/LangSwitcherModal";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { IProfile } from "@/types/profile-type/profile-type";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";
import { routes, sellerRoutes } from "../routes/routes";
import Image from "next/image";

const HeaderDashboard: React.FC = () => {
    const t = useTranslations('dashboardHeader');
    const tRout = useTranslations('dashboardSidebar');
    const { theme, toggleTheme } = useTheme();
    const [modalView, setModalView] = React.useState(false);
    const moreRef = useRef<HTMLDivElement | null>(null);
    const pathname = useClearPathname();
    const { data: session } = useSession() as any;
    const dir = useDirection()

    const [role, setRole] = useState("");
    const routeSelect = role === "seller" ? sellerRoutes : routes;


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setModalView(false);
            }
        }
        if (modalView) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalView])

    const [profile, setProfile] = useState<IProfile | null>(null);

    const getProfileState = useCallback(async () => {
        if (session?.userInfo?.id) {
            const profile = await getProfileById(session.userInfo.id);
            setProfile(profile);
            setRole(profile?.role)
        }
    }, [session?.userInfo])

    useEffect(() => {
        getProfileState();
    }, [getProfileState]);

    return (
        <Fragment>
            <div dir={dir} className='bg-subBg w-full rounded-[12px] px-8 py-3 flex items-center justify-between'>
                {routeSelect.map(({ label, href }) => {
                    return pathname === href && (
                        <TypingAnimation key={tRout(label)} className='font-extrabold text-xl'>
                            {tRout(label)}
                        </TypingAnimation>
                    )
                }
                )}
                <div></div>
                <div className='flex gap-4 items-center'>
                    <div className="max-md:hidden">
                        <LanguageSwitcher />
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-subBg2 transition-colors"
                        aria-label={theme === "dark" ? t('lightMode') : t('darkMode')}
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-subText hover:text-primary" />
                        ) : (
                            <Moon className="w-5 h-5 text-subText hover:text-primary" />
                        )}
                    </button>
                    <Bell onClick={() => redirect("/dashboard/notifications")} className="cursor-pointer" />
                    <div className="relative">
                        <div onClick={() => {
                            setModalView(!modalView)
                        }} className="flex relative gap-4 items-center cursor-pointer">
                            <Image src={session?.user?.image || profile?.profilePicture || "/"} alt="" width={40} height={40} className="border-0 outline-none bg-secondary-light rounded-[8px]" />
                            <div className="flex max-md:hidden flex-col justify-between">
                                <h2>{session?.user?.name || (profile?.firstName ?? "") + " " + (profile?.lastName ?? "")}</h2>
                                <span className="text-muted-foreground text-sm">{profile?.role}</span>
                            </div>
                            {!modalView && <ChevronDown className="cursor-pointer" size={12} />}
                            {modalView && <ChevronUp className="cursor-pointer" size={12} />}
                        </div>
                        {modalView && <div
                            ref={moreRef}
                            className="absolute top-full left-0 z-50 min-w-[180px] w-max rounded-xl backdrop-blur-md shadow-xl border border-border text-sm p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1"
                        >
                            <div className="flex flex-col divide-y divide-border">
                                <div className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
                                    <PlusCircle size={16} className="text-primary" />
                                    <span className="text-sm">{t('walletCharge')}</span>
                                </div>
                                <LangModal />

                                <NotifModal />

                                <CommonModal
                                    handleClick={t('logout')}
                                    buttonTitle={t('logoutAccount')}
                                    buttonIcon={<LogOut size={16} className="text-destructive" />}
                                    onClick={handleLogout(signOut, "/login")}
                                    title={t('logoutConfirm')}
                                />
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default HeaderDashboard;