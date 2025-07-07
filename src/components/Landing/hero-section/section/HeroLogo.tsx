import React from "react";
import HeroLogoImage from "@/assets/images/heroSection/Group 12.svg";
import Image from "next/image";

const HeroLogo = () => {
  return (
    <div className="flex items-baseline mt-20 w-full z-19">
      <Image src={HeroLogoImage.src || "/"} alt=" " width={100} height={20} className="w-full h-auto" />
    </div>
  );
};

export default HeroLogo;
