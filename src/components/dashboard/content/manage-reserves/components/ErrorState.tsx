import { BlurFade } from "@/components/magicui/blur-fade";
import { useTranslations } from "next-intl";

export default function ErrorState() {
  const t = useTranslations("dashboardBuyer.manageReserves");

  return (
    <BlurFade className="flex flex-col justify-between gap-8 bg-subBg p-4 sm:p-6 lg:p-8 rounded-xl w-full min-h-screen">
      <div className="flex items-center justify-center h-full">
        <p className="text-danger">{t("errorLoading")}</p>
      </div>
    </BlurFade>
  );
} 