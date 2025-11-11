/* eslint-disable */

"use client";

import {
  LogOut,
  LogIn,
  ChevronDown,
  PlusCircle,
  CreditCard,
  SquaresSubtract,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import PaymentsModal from "../../modal/PaymentsModal";
import MobileSidebar from "./MobileSidebar";
import TabletSidebar from "./TabletSidebar";
import useClearPathname from "@/utils/helper/clearPathname/clearPathname";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { useSession } from "next-auth/react";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";
import { routes, sellerRoutes } from "../routes/routes";

const SidebarDashboard = ({
  view,
  setView,
}: {
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const pathname = useClearPathname();
  const moreRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const t = useTranslations("dashboardSidebar")
  const dir = useDirection()
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
  const Icon = footerSidebarSelect.icon;

  const { data: session } = useSession() as any
  
  const getProfile = useCallback(async () => {
    const user = await getProfileById(session?.userInfo.id)
    setRole(user.user.role)
  }, [session])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const checkScreenWidth = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 1200) {
          setView(2);
        }
      }
    };

    checkScreenWidth();

    if (typeof window !== 'undefined') {
      window.addEventListener("resize", checkScreenWidth);
      return () => {
        window.removeEventListener("resize", checkScreenWidth);
      };
    }
  }, [setView]);

  return (
    <>
      <div
        dir={dir}
        className={`bg-subBg md:flex hidden transition-all duration-300 ease-in-out px-4 border py-8 gap-8 rounded-xl w-fit flex-col shadow-md ${view === 1
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none absolute"
          }`}
      >
        <div className="flex justify-between items-center mb-6 min-w-[200px]">
          <Link href={"/"} className="text-2xl font-bold">
            {t("brand")}
          </Link>
          <LogOut
            onClick={() => setView(2)}
            className={`cursor-pointer hover:text-accent transition-colors ${dir === 'rtl' ? "rotate-0" : "rotate-180"}`}
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2">
            {((role === "seller" || role === "admin") ? sellerRoutes : routes).map(({ label, href, icon: Icon, children }) => {
              const isActive = pathname === href;
              const isDropdownOpen = openDropdown === href;

              const handleClick = (e: React.MouseEvent) => {
                if (children) {
                  e.preventDefault();
                  setOpenDropdown((prev) => (prev === href ? null : href));
                }
              };

              return (
                <div key={href} className="flex flex-col">
                  <Link
                    href={href}
                    onClick={handleClick}
                    className={`whitespace-nowrap flex justify-between items-center px-3 py-2 rounded-lg font-medium transition-colors ${isActive
                      ? "dark:bg-accent dark:text-accent-foreground bg-subBg2"
                      : "hover:bg-subBg2 bg-none"
                      }`}
                  >
                    <div className="flex gap-2">
                      <Icon className="min-w-5 min-h-5 h-5 w-5" />
                      <span>{t(label)}</span>
                    </div>
                    {children && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </Link>

                  {isDropdownOpen && children && (
                    <div className="pr-2 flex flex-col gap-2 mt-1">
                      {children?.map(({ label, href, icon: Icon }) => {
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
                              <Icon className="min-w-5 min-h-5 h-5 w-5" />
                              <span>{t(label)}</span>
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

      <TabletSidebar setView={setView} view={view} />

      <MobileSidebar />
    </>
  );
};

export default SidebarDashboard;
