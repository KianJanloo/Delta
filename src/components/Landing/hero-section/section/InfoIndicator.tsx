import React from "react";
import Image from "next/image";
import Frame from "@/assets/images/heroSection/Frame.svg";
import {useTranslations} from 'next-intl';
import { useDirection } from "@/utils/hooks/useDirection";

const InfoIndicator = () => {

  const dir = useDirection();
  const t = useTranslations('landing.heroSection');

  return (
    <div className={` flex items-center `}>
      <div dir={dir} className="mb-4 text-white flex flex-col">
        <span className="text-base max-md:text-sm max-sm:text-xs mb-1">  {t("infoNumb")} </span>
        <span className="text-sm sm:text-xs min-w-[100px]"> {t("info")}  </span>
      </div>
      <Image src={Frame} className="relative top-8" alt="Frame" width={45} height={46} />
    </div>
  );
};

export default InfoIndicator;
