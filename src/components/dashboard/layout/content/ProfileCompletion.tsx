/* eslint-disable */

"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IProfile } from "@/types/profile-type/profile-type";
import { getRelativeTimeString } from "@/utils/helper/date";
import { calculateProfileCompletion } from "@/utils/helper/completeProfile/completeProfile";

const ProfileCompletion = () => {
  const t = useTranslations("dashboardBuyer");
  const { data: session } = useSession() as any;
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const getProfile = useCallback(async () => {
      if (session?.userInfo?.id) {
        const profile = await getProfileById(session?.userInfo?.id);
        setProfile(profile);
        setCompletionPercentage(calculateProfileCompletion(profile));
      }
  }, [session])

  useEffect(() => {
    getProfile()
  }, [getProfile]);

  return (
    <BlurFade
      className=" lg:w-[40%] md:w-full sm:w-full w-full h-60 bg-subBg rounded-2xl p-6 flex items-center gap-6 shadow-lg border ltr "
      delay={0.25} inView
    >
      <div className="w-28 ">
        <CircularProgressbar
          value={completionPercentage}
          text={`${completionPercentage}%`}
          styles={buildStyles({
            textSize: "20px",
            pathColor: "var(--primary)",
            textColor: "var(--secondary-foreground)",
          })}
        />
      </div>

      <div className="flex flex-col justify-between h-full text-right w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-1 rotate-180 items-center  justify-between ml-[-100px]">
            <Link href={"/dashboard/profile"} className=" rotate-180 text-sm text-primary font-medium cursor-pointer hover:underline">
              {t("edit")}
            </Link>
            <svg
              width="42"
              height="15"
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

          <h2 className="text-sm md:text-sm font-semibold sm:text-sm lg:text-base">
            {t("profileStatus")}
          </h2>
        </div>

        <p className="text-3xl font-bold text-primary">{completionPercentage}%</p>
        <p className="text-sm lg:text-sm md:text-xs sm:text-xs text-muted-foreground leading-relaxed mt-2">
        برای اینکه بازدید خوبی داشته باشید، پروفایل شما باید حداقل {100 - completionPercentage}% تکمیل شده باشد
        </p>
        <span className="text-xs text-ring mt-3">
          اخرین تغییرات {profile?.updatedAt ? getRelativeTimeString(profile.updatedAt) : ''}
        </span>
      </div>
    </BlurFade>
  );
};

export default ProfileCompletion;