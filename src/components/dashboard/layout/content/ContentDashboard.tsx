"use client";
import { HeartIcon, MessageCircleIcon, PinIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import img from "@/assets/Rectangle 6486.png";
import ProfileCompletion from "./ProfileCompletion";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ReservesCha from "./ReservesCha";
import CallReserves from "./CallReserves";
import { getDashboardSummary } from "@/utils/service/api/dashboard/getDashboardSummary";
import { IDashboardSummary } from "@/types/dashboard-type/summary-type/summary-type";
import { Loader } from "@/components/common/Loader";

const ContentDashboard = () => {
  const t = useTranslations("dashboardBuyer");
  const [summary, setSummary] = useState<IDashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getSummary = async () => {
    const summary = await getDashboardSummary();
    setSummary(summary);
    setLoading(false);
  };

  const cardData = [
    {
      id: 1,
      title: summary?.houses,
      subtitle: " کل املاک",
      href: "/dashboard/manage-reserves",
    },
    {
      id: 2,
      title: summary?.bookings,
      subtitle: " کل رزرو ها",
      href: "/dashboard/manage-reserves",
    },
    {
      id: 4,
      title: summary?.users,
      subtitle: " کل کاربران",
      href: "/dashboard/manage-reserves",
    },
    {
      id: 3,
      title: summary?.averageRating,
      subtitle: " میانگین امتیاز",
      href: "/dashboard/favorites",
    },
  ];

  useEffect(() => {
    getSummary();
  }, []);

  if (loading)
    return (
      <div className="w-full h-full pt-[250px] flex justify-center items-center">
        <div className="w-[250px] mx-auto">
          <Loader />
        </div>
      </div>
    );

  return (
    <div className="flex justify-center flex-col w-full gap-2">
      <div className="flex flex-wrap justify-between gap-7 w-full overflow-x-hidden">
        {cardData.map((item, idx) => (
          <BlurFade
            inView
            delay={idx / 5}
            key={idx}
            className="relative bg-subBg rounded-xl px-4 pt-4 flex flex-col items-center justify-between
              w-full sm:w-[47%] md:w-[30%] lg:w-[22%] xl:w-[21%]"
          >
            <div className="absolute top-0 right-6 w-10 h-12 rounded-b-2xl bg-card-secondary2 flex justify-center items-center ">
              {item.id === 4 ? (
                <HeartIcon size={20} />
              ) : item.id === 5 ? (
                <MessageCircleIcon size={20} />
              ) : (
                <PinIcon size={20} />
              )}
            </div>

            <div className="text-start w-full mr-28">
              <span className="text-xl font-bold block">{item.title}</span>
              <span className="text-[12px] text-muted-foreground block">
                {item.subtitle}
              </span>
            </div>

            <Image
              alt="dashboard-img"
              src={img}
              className="w-full rounded-b-xl object-cover my-2 "
            />
            <div className="flex flex-row justify-between w-full items-center mt-2">
              <Link
                href={item.href}
                className=" text-textComment dark:text-bacgkroundW"
              >
                {t("details")}
              </Link>

              <div className="flex gap-1 rotate-180 justify-center items-center ">
                <svg
                  width="48"
                  height="17"
                  viewBox="0 0 48 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill-primary"
                    d="M45 10.1598C46.3333 9.38998 46.3333 7.46548 45 6.69568L39 3.23158C37.6667 2.46178 36 3.42403 36 4.96363L36 11.8918C36 13.4314 37.6667 14.3937 39 13.6239L45 10.1598Z"
                  />
                  <path
                    d="M23.75 9.72677C24.75 9.14942 24.75 7.70605 23.75 7.1287L19.25 4.53062C18.25 3.95327 17 4.67496 17 5.82966L17 11.0258C17 12.1805 18.25 12.9022 19.25 12.3248L23.75 9.72677Z"
                    className="fill-primary"
                    fillOpacity="0.5"
                  />
                  <path
                    d="M6.5 9.29376C7.16667 8.90886 7.16667 7.94661 6.5 7.56171L3.5 5.82966C2.83333 5.44476 2 5.92588 2 6.69568L2 10.1598C2 10.9296 2.83333 11.4107 3.5 11.0258L6.5 9.29376Z"
                    className="fill-primary"
                    fillOpacity="0.25"
                  />
                </svg>
              </div>
            </div>
          </BlurFade>
        ))}
        <div className="flex flex-col justify-center gap-8 w-full  sm:flex-col lg:flex-row ">
          <ReservesCha />
          <ProfileCompletion />
        </div>
        <CallReserves />
      </div>
    </div>
  );
};

export default ContentDashboard;
