/* eslint-disable */

"use client";
import { Bell, ChevronDown, ChevronUp, LogOut, PlusCircle } from "lucide-react";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CommonModal from "../../modal/CommonModal";
import { signOut, useSession } from "next-auth/react";
import { handleLogout } from "@/core/logOut";
import NotifModal from "../../modal/NotifModal";
import { useRouter } from "next/navigation";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import useClearPathname from "@/utils/helper/clearPathname/clearPathname";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { IProfile } from "@/types/profile-type/profile-type";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";
import { adminRoutes, routes, sellerRoutes } from "../routes/routes";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PanelKey = "admin" | "seller" | "buyer";

interface HeaderDashboardProps {
  activePanel: PanelKey;
  onPanelChange: (panel: PanelKey) => void;
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  activePanel,
  onPanelChange,
}) => {
  const t = useTranslations("dashboardHeader");
  const tRout = useTranslations("dashboardSidebar");
  const [modalView, setModalView] = React.useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const pathname = useClearPathname();
  const { data: session } = useSession() as any;
  const dir = useDirection();
  const router = useRouter();

  const [role, setRole] = useState("");
  const typeRole = (role: string) => {
    switch (role) {
      case "seller":
        return "فروشنده";
      case "admin":
        return "مدیر سیستم";
      default:
        return "خریدار";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setModalView(false);
      }
    };
    if (modalView) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalView]);

  const [profile, setProfile] = useState<IProfile | null>(null);

  const getProfileState = useCallback(async () => {
    if (session?.userInfo?.id) {
      const profile = await getProfileById(session.userInfo.id);
      setProfile(profile.user);
      setRole(profile?.user.role);
    }
  }, [session?.userInfo]);

  useEffect(() => {
    getProfileState();
  }, [getProfileState]);

  const activeRoutes = useMemo(() => {
    if (pathname.startsWith("/dashboard/admin")) {
      return adminRoutes;
    }
    if (pathname.startsWith("/dashboard/seller")) {
      return sellerRoutes;
    }
    return routes;
  }, [pathname]);

  const panelOptions = useMemo(() => {
    if (role === "admin") {
      return [
        { value: "admin" as const, label: t("panelOptionAdmin") },
        { value: "seller" as const, label: t("panelOptionSeller") },
        { value: "buyer" as const, label: t("panelOptionBuyer") },
      ];
    }
    if (role === "seller") {
      return [
        { value: "seller" as const, label: t("panelOptionSeller") },
        { value: "buyer" as const, label: t("panelOptionBuyer") },
      ];
    }
    return [];
  }, [role, t]);

  const currentRouteLabel = useMemo(() => {
    const match = activeRoutes.find(({ href }) => href === pathname);
    return match ? tRout(match.label) : "";
  }, [activeRoutes, pathname, tRout]);

  const panelBadgeLabel = useMemo(() => {
    switch (activePanel) {
      case "admin":
        return t("panelOptionAdmin");
      case "seller":
        return t("panelOptionSeller");
      default:
        return t("panelOptionBuyer");
    }
  }, [activePanel, t]);

  const handlePanelSelect = useCallback(
    (value: PanelKey) => {
      if (value === activePanel) return;
      onPanelChange(value);
    },
    [activePanel, onPanelChange]
  );

  return (
    <Fragment>
      <div dir={dir} className="sticky top-0 z-40 md:static md:z-auto">
        <div className="relative w-full rounded-2xl border border-border/50 bg-subBg px-4 sm:px-6 lg:py-4 py-1 shadow-lg backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-transparent opacity-75" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-lg:hidden flex flex-col gap-3 text-center lg:text-start">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start lg:gap-3">
                {currentRouteLabel && (
                  <TypingAnimation className="text-lg font-extrabold tracking-tight leading-tight">
                    {currentRouteLabel}
                  </TypingAnimation>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {panelBadgeLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-row justify-between gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-end lg:flex-wrap">
              {(role === "admin" || role === "seller") &&
                panelOptions.length > 0 && (
                  <div className="flex w-fit flex-col gap-2 rounded-xl bg-background px-3 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:gap-3 sm:py-2">
                    <span className="hidden text-xs uppercase tracking-[0.12em] text-muted-foreground lg:inline">
                      {t("panelSwitchLabel")}
                    </span>
                    <Select
                      value={activePanel}
                      onValueChange={(value) =>
                        handlePanelSelect(value as PanelKey)
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className="w-full min-w-0 justify-between bg-transparent text-sm font-medium sm:w-[180px] sm:min-w-[180px]"
                      >
                        <SelectValue
                          placeholder={t("panelSwitchPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {panelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

              <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                <button
                  onClick={() => router.push("/dashboard/notifications")}
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-background/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary hover:shadow-md"
                  type="button"
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">{t("notificationsButton")}</span>
                </button>

                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => setModalView(!modalView)}
                    className="flex w-full items-center gap-3 rounded-xl bg-background/50 px-3 py-2 shadow-sm transition hover:border-primary/40 hover:bg-background/80"
                    type="button"
                  >
                    <Image
                      src={
                        session?.user?.image || profile?.profilePicture || "/"
                      }
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-lg border border-border/40 object-cover"
                    />
                    <div className="hidden min-w-0 flex-1 flex-col gap-1 text-left md:flex">
                      <h2 className="truncate text-sm font-semibold leading-none text-foreground">
                        {session?.user?.name ||
                          (profile?.firstName ?? "") +
                            " " +
                            (profile?.lastName ?? "")}
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        {typeRole(profile?.role ?? "")}
                      </span>
                    </div>
                    {!modalView && (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                    {modalView && (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    )}
                  </button>
                  {modalView && (
                    <div
                      ref={moreRef}
                      className="absolute right-0 top-[calc(100%+12px)] z-50 min-w-[220px] rounded-xl border border-border bg-background p-2 shadow-xl backdrop-blur-md"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-subBg2">
                          <PlusCircle size={16} className="text-primary" />
                          <span className="text-sm">{t("walletCharge")}</span>
                        </div>

                        <NotifModal />

                        <CommonModal
                          handleClick={t("logout")}
                          onClick={handleLogout(signOut, "/login")}
                          title={t("logoutConfirm")}
                          button={
                            <div
                              role="button"
                              tabIndex={0}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition hover:bg-subBg2 focus:outline-none focus:ring-2 focus:ring-destructive/40"
                            >
                              <LogOut size={16} className="text-destructive" />
                              <span>{t("logoutAccount")}</span>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HeaderDashboard;
