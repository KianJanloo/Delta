"use client";
import Link from "next/link";
import { useTheme } from "@/utils/service/TanstakProvider";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LangSwitcher";

const MobileNavbarSection = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("common.header")

  return (
    <nav className="flex flex-col w-full space-y-6">
      <div className="relative">
        <Link
          className="flex items-center justify-between w-full mb-2 cursor-pointer"
          href={`/reserve/reserve-house`}
        >
          <span className="text-subText hover:text-primary transition-colors flex items-center gap-1">
            {t("navbar.quicklyReserve")}
          </span>
        </Link>
      </div>

      <div className="relative">
        <Link
          className="flex items-center justify-between w-full mb-2 cursor-pointer"
          href={`/rent`}
        >
          <span className="text-subText hover:text-primary transition-colors flex items-center gap-1">
            {t("navbar.rentalMortgage")}
          </span>
        </Link>
      </div>

      <div>
        <Link
          href="/about"
          className="text-subText transition-colors hover:text-primary block"
        >
          {t("navbar.aboutUs")}
        </Link>
      </div>

      <div>
        <Link
          href="/articles"
          className="text-subText transition-colors hover:text-primary block"
        >
          {t("navbar.articles")}
        </Link>
      </div>

      <div>
        <Link
          href="/contact"
          className="text-subText transition-colors hover:text-primary block"
        >
          {t("navbar.contactUs")}
        </Link>
      </div>

      <div className="flex items-center pt-2">
        <span className="text-foreground ml-3"> {t("changeTheme")} </span>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-subBg2 transition-colors"
          aria-label={
            theme === "dark" ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"
          }
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center pt-2">
        <span className="text-foreground ml-3"> {t("changeLang")} </span>
        <LanguageSwitcher />
      </div>

      <div className="pt-4 mt-2 border-t border-border">
        <Link
          href="/become-seller"
          className="bg-accent text-accent-foreground px-4 py-2 rounded-[10px] hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5 ml-1"
          >
            <path d="M2 10V7a2 2 0 012-2h2.382a2 2 0 001.447-.618l2.382-2.618A1 1 0 0112 3v14a1 1 0 01-1.789.707l-2.382-2.618A2 2 0 016.382 15H4a2 2 0 01-2-2v-3z" />
            <path d="M15 8v4" strokeLinecap="round" />
            <path d="M17 9v2" strokeLinecap="round" />
          </svg>
          {t("become-seller")}
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavbarSection;
