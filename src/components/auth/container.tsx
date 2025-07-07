'use client'
import authBanner from "../../assets/images/LoginBanner.png";
import score from "@/assets/score.png"
import Image from "next/image";
import { BlurFade } from "../magicui/blur-fade";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";

const AuthContainer = ({ children }: { children: React.ReactNode; }) => {
  const t = useTranslations("auth.container");
  const dir = useDirection();

  return (
    <div dir={dir} className="flex gap-16 text-card-foreground h-fit lg:pr-8 px-8 mt-[100px] items-center">
      <BlurFade className="lg:w-1/2 w-full">
        {children}
      </BlurFade>
      <div dir={"rtl"} className="w-1/2 h-4/5 relative lg:flex justify-center hidden">
        <Image src={authBanner} width={900} className="rounded-[40px]" height={500} alt="auth banner" />
        <div className="w-11/12 mx-[20px] h-[97] px-4 py-2 bg-[#363636C7] backdrop-blur-[8] border-[#686868] text-white absolute bottom-4 flex justify-between items-center rounded-[32px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-[20px]">{t("customersCount")}</h2>
            <span>{t("customersExperience")}</span>
          </div>
          <Image src={score} width={170} height={166} alt="score" className="absolute xl:block hidden bottom-0 left-0" />
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;