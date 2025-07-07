import { NumberTicker } from "@/components/magicui/number-ticker";
import { useTranslations } from "next-intl";
import React from "react";

const StatisticSection = () => {

  const t = useTranslations('landing.heroSection');

  return (
    <div className="hidden sm:flex justify-evenly gap-8  mb-8 mt-6 text-foreground">
      <div className="text-center">
        <span className="text-xl sm:text-md font-bold"> + </span>
        <NumberTicker value={8500} className="text-xl sm:text-md font-bold" />
        <p className="text-xs"> {t("infoButton")} </p>
      </div>
      <div className="text-center">
        <span className="text-xl sm:text-md font-bold"> + </span>
        <NumberTicker value={5000} className="text-xl sm:text-md font-bold" />
        <p className="text-xs"> {t("infoButton2")} </p>
      </div>
    </div>
  );
};

export default StatisticSection;
