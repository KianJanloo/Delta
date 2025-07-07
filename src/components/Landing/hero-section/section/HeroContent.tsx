import { Sparkle } from "lucide-react";
import React from "react";
import LinkButtons from "@/components/common/buttons/common/LinkButtons";
import { useDirection } from "@/utils/hooks/useDirection";
import { useTranslations } from "next-intl";

const HeroContent = () => {

  const dir = useDirection();
  const t = useTranslations('landing.heroSection');

  return (
    <div className="text-foreground">
      <div dir={dir} className="mb-4 md:mb-8">
        <p className="text-sm sm:text-xs min-w-[150px] md:text-sm mb-1 flex items-center justify-center  gap-2">
          <Sparkle className="w-5 h-5" />
          {t("infoLong")}
          <br className="md:hidden lg:block" />
          {t("infoLong2")}
        </p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-4 md:gap-8 flex-wrap">
        <LinkButtons variant="scale" classname="bg-secondary text-foreground text-xs md:text-sm lg:text-base w-fit" link="/reserve/reserve-house" title={t("button")} />
        <LinkButtons variant="scale" classname="bg-foreground text-secondary text-xs md:text-sm lg:text-base w-fit" link="/rent" title={t("button2")} />
      </div>
    </div>
  );
};

export default HeroContent;
