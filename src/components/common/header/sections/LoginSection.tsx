/* eslint-disable */

"use client";
import { User, LogOut, LayoutDashboard, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/utils/zustand/store";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { handleLogout } from "@/core/logOut";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { IProfile } from "@/types/profile-type/profile-type";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";
import ChatButton from "@/components/chat/ChatButton";

const LoginSection = () => {
  const { checkAuthStatus } = useUserStore();
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
      setProfile(profile.user);
    }
  }

  useEffect(() => {
    getProfileState();
  }, [session]);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex whitespace-nowrap items-center xl:px-8 px-4 justify-end gap-3 xl:text-[16px] text-[12px]">

      {!session ? (
        <Link
          href="/login"
          className="text-subText hover:text-primary transition-colors flex items-center gap-1"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-4 lg:w-6 lg:h-6" />
          <span> {t("signin")} </span>
        </Link>
      ) : (
        <>
          <ChatButton />
          <div className="relative group" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 py-2 rounded-2lg hover:bg-subBg text-foreground cursor-pointer transition-colors rounded-full"
            onClick={() => setDropdownVisible(!isDropdownVisible)}
          >
            {(session.user?.image && session.user?.image !== "") || (profile?.profilePicture && profile?.profilePicture !== "") ? (
              <Image
                alt=" "
                src={session.user?.image || profile?.profilePicture}
                className="w-8 h-8 rounded-full object-cover"
                width={200}
                height={40}
              />
            ) : (
              <User className="text-subText w-6 h-6" />
            )}
          </div>

          {isDropdownVisible && (
            <div className={`absolute top-full ${dir === "rtl" ? "left-0" : "right-0"} mt-1 w-36 sm:w-44 md:w-48 lg:w-56 opacity-100 visible transition-all duration-200 z-10`}>
              <div className="bg-secondary border border-border rounded-md shadow-lg py-1 text-right">
                <Link
                  href={`${session.userInfo.role === "buyer" ? "/dashboard" : "/dashboard/seller"}`}
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
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default LoginSection;
