"use client";
import React, { useState, useEffect, useRef } from "react";
import LogoSection from "./sections/LogoSection";
import NavbarSection from "./sections/NavbarSection";
import MobileNavbarSection from "./sections/MobileNavbarSection";
import LoginSection from "./sections/LoginSection";
import { useDirection } from "@/utils/hooks/useDirection";
import useClearPathname from "@/utils/helper/clearPathname/clearPathname";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = useClearPathname()

  const dir = useDirection()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isDrawerOpen]);

  if (pathname.includes("/dashboard")) return null;

  return <div className="w-full flex justify-center items-center relative">
    {isDrawerOpen && (
      <div
        className="relative inset-0 bg-black/50 z-60 animate-overlayShow"
        onClick={() => setIsDrawerOpen(false)}
      />
    )}

    <div
      ref={drawerRef}
      className={`fixed lg:hidden top-0 right-0 h-full w-72 bg-secondary z-[100] shadow-lg transform ${isDrawerOpen ? "animate-drawerSlideIn" : "translate-x-full"
        } overflow-y-auto`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <LogoSection />
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 text-subText hover:text-primary"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-6">
          <MobileNavbarSection />
        </div>
      </div>
    </div>

    <div dir={dir} className="w-[100%] flex items-center justify-between py-1 absolute top-[24px] bg-subBg text-subText rounded-[16px]  z-50">
      <div className="hidden lg:flex items-center h-full gap-5 ">
        <LogoSection />
        <NavbarSection />
      </div>

      <div className="hidden lg:flex items-center">
        <LoginSection />
      </div>

      <div className="flex lg:hidden items-center px-4 justify-between w-full">
        <div>
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 focus:outline-none mr-2"
            aria-label="Toggle Menu"
            aria-expanded={isDrawerOpen}
          >
            <span
              className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isDrawerOpen ? "rotate-45 translate-y-1" : ""
                }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-current my-1 transition-all duration-300 ${isDrawerOpen ? "opacity-0" : ""
                }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isDrawerOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
            ></span>
          </button>
        </div>

        <div>
          <LoginSection />
        </div>
      </div>
    </div>
  </div>
};

export default Header;
