"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import darkHeroSection from "@/assets/images/heroSection/landingHerosectiondark.png";
import lightHeroSection from "@/assets/images/heroSection/landingHerosectionlight.png";
import building from "@/assets/images/heroSection/building.png";
import HeroLogo from "./section/HeroLogo";
import HeroContent from "./section/HeroContent";
import StatisticSection from "./section/StatisticSection";
import SearchBar from "./section/SearchBar";
import InfoIndicator from "./section/InfoIndicator";
import { useTheme } from "@/utils/service/TanstakProvider";

const HeroSection = () => {
  const { theme } = useTheme();
  const [heroSection, setHeroSection] = useState(darkHeroSection);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setHeroSection(theme === "dark" ? darkHeroSection : lightHeroSection);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full h-[480px] sm:h-[625] md:h-[760px] 2xl:h-[840px] ">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroSection}
          alt="hero-section"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div
        className="absolute bottom-0 left-1/2 max-md:-z-0 lg:left-3/8 md:left-1/2 sm:left-3/8 transform -translate-x-1/4 md: z-40"
      >
        <Image src={building} alt="building" className="object-contain" />
      </div>

      <div className="relative -top-10 z-20 h-full w-full px-8 py-6 gap-8 flex flex-col justify-center">
        <div className="flex flex-col items-start  mx-auto">
          <HeroLogo />
        </div>
        <div className="flex  w-full  justify-between items-center z-30">
          <div className=" flex flex-col justify-center items-end border-red-500 w-[25%] ">
            <InfoIndicator />
          </div>

          <div className=" gap-10 w-[40%] ">
            <HeroContent />

            <StatisticSection />
          </div>
        </div>
      </div>
      <SearchBar />
    </div>
  );
};

export default HeroSection;
