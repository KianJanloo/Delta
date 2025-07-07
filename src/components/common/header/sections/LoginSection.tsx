/* eslint-disable */

"use client";
import { User, LogOut, LayoutDashboard, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useUserStore } from "@/utils/zustand/store";
import { useTheme } from "@/utils/service/TanstakProvider";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { handleLogout } from "@/core/logOut";
import LanguageSwitcher from "./LangSwitcher";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { IProfile } from "@/types/profile-type/profile-type";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";

const LoginSection = () => {
  const { checkAuthStatus } = useUserStore();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession() as any;

  const t = useTranslations("common.header");
  const dir = useDirection();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const [profile, setProfile] = useState<IProfile | null>(null);

  const getProfileState = async () => {
    if (session?.userInfo?.id) {
      const profile = await getProfileById(session?.userInfo?.id);
      setProfile(profile);
    }
  }

  useEffect(() => {
    getProfileState();
  }, [session]);

  return (
    <div className="flex whitespace-nowrap items-center xl:px-8 px-4 justify-end gap-3 xl:text-[16px] text-[12px]">
      <div className="max-md:hidden">
        <LanguageSwitcher />
      </div>
      <motion.button
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        exit={{ rotate: -360, scale: 0 }}
        transition={{ duration: 0.5 }}
        onClick={toggleTheme}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-subBg2 transition-colors"
        aria-label={theme === "dark" ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-subText hover:text-primary" />
        ) : (
          <Moon className="w-5 h-5 text-subText hover:text-primary" />
        )}
      </motion.button>


      {!session ? (
        <Link
          href="/login"
          className="text-subText hover:text-primary transition-colors flex items-center gap-1"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-4 lg:w-6 lg:h-6" />
          <span> {t("signin")} </span>
        </Link>
      ) : (
        <div className="relative group" ref={dropdownRef}>
          <Link href={"/login"} className="flex items-center gap-2 py-2 rounded-2lg hover:bg-subBg text-foreground cursor-pointer transition-colors rounded-full">
            {(session.user?.image && session.user?.image !== "") || (profile?.profilePicture && profile?.profilePicture !== "") ? (
              <Image
                alt=" "
                src={session.user?.image || profile?.profilePicture}
                className="w-8 h-8 rounded-full"
                width={200}
                height={40}
              />
            ) : (
              <User className="text-subText w-6 h-6" />
            )}
          </Link>

          <div className={`absolute top-full ${dir === "rtl" ? "left-0" : "right-0"} mt-1 w-36 sm:w-44 md:w-48 lg:w-56 opacity-0 invisible md:group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10`}>
            <div className="bg-secondary border border-border rounded-md shadow-lg py-1 text-right">
              <Link
                href="/dashboard"
                className="px-2 sm:px-3 md:px-4 py-2 md:py-3 text-[10px] sm:text-xs md:text-sm text-foreground hover:bg-subBg transition-colors flex items-center gap-1 sm:gap-2"
              >
                <LayoutDashboard
                  size={14}
                  className="text-primary sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                />
                <span> {t("goToAccount")} </span>
              </Link>
              <button
                onClick={handleLogout(signOut, '/login')}
                className="w-full px-2 sm:px-3 md:px-4 py-2 md:py-3 text-[10px] sm:text-xs md:text-sm text-foreground hover:bg-subBg transition-colors flex items-center gap-1 sm:gap-2"
              >
                <LogOut
                  size={14}
                  className="text-danger sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                />
                <span> {t("logout")} </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSection;
