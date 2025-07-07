"use client";
import React, { ReactNode } from "react";
import productMangment from "@/assets/3d-icon-product-management_23-2150459932.png";
import Image, { StaticImageData } from "next/image";
import Jam from "@/assets/m502t0008_06jun22_trophy_02 1.png";
import Speaker from "@/assets/a.png";
import Love from "@/assets/heart3 1.png";
import { ClockIcon, HomeIcon, SmileIcon, TrophyIcon } from "lucide-react";
import arrow from "@/assets/arrow.svg";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  image: string | StaticImageData;
  useBlueFill?: boolean;
}

export default function DeltaAboutUsSection() {

  const t = useTranslations("landing.aboutUs");

  const CustomCard = ({
    icon,
    title,
    description,
    image,
    useBlueFill = false,
  }: Props) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[450px] mx-auto"
        style={{ paddingTop: "57.56%" }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 445 205"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-secondary-light2"
            d="M285 35C290.7 35 296.3 32.9 300.6 29.1L322.8 10.4C327.1 6.6 332.7 4.5 338.4 4.5L428 4.5C441.3 4.5 452 15.2 452 28.5V206.5C452 219.8 441.3 230.5 428 230.5H28C14.7 230.5 4 219.8 4 206.5V58.5C4 45.2 14.7 34.5 28 34.5H285Z"
          />

          <g transform="scale(0.9) translate(30, 18)">
            <path
              className={useBlueFill ? "fill-card-light" : "fill-background"}
              d="M285 35C290.7 35 296.3 32.9 300.6 29.1L322.8 10.4C327.1 6.6 332.7 4.5 338.4 4.5L428 4.5C441.3 4.5 452 15.2 452 28.5V206.5C452 219.8 441.3 230.5 428 230.5H28C14.7 230.5 4 219.8 4 206.5V58.5C4 45.2 14.7 34.5 28 34.5H285Z"
            />

            <foreignObject
              width="100%"
              height="225"
              style={{
                padding: "24px",
                paddingTop: "80px",
                paddingBottom: "48px",
                margin: "auto",
                gap: "10px",
              }}
            >
              <div className="absolute top-8 right-6 h-14 w-14 bg-bacgkroundW rounded-md flex items-center justify-center">
                {icon}
              </div>

              <div
                className="flex flex-row-reverse mx-6 my-4 items-center h-full gap-6 md:gap-3"
                dir="ltr"
              >
                <div className="flex flex-col w-full items-center gap-2 text-right">
                  <h3 className="text-xl font-bold text-foreground w-full truncate overflow-hidden whitespace-nowrap">
                    {title}
                  </h3>
                  <p className="text-md text-subText w-full truncate overflow-hidden whitespace-nowrap">
                    {description}
                  </p>
                </div>

                <div className="flex justify-end w-full h-full">
                  <div className="absolute left-[4px] bottom-[76px] w-[135px] h-[115px] overflow-hidden rounded-3xl rotate-8">
                    <Image
                      src={image}
                      alt="icon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>
        </svg>
      </motion.div>
    );
  };

  const CenterCard = () => {

    return (
      <svg
        width="100%"
        height="300"
        viewBox="0 0 446 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto max-w-full"
      >
        <path
          className="fill-secondary-light2"
          d="M280.324 31C286.111 31 291.702 28.9092 296.07 25.1127L318.185 5.8873C322.552 2.09078 328.144 0 333.931 0L422 0C435.255 0 446 10.7452 446 24V446C446 459.255 435.255 470 422 470H24C10.7452 470 0 459.255 0 446L0 55C0 41.7452 10.7452 31 24 31H280.324Z"
        />

        <svg
          x="12"
          y="30"
          width="422"
          height="406"
          viewBox="0 0 422 446"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-blur-blue"
            d="M277.751 29.417C283.704 29.417 289.444 27.205 293.857 23.2105L312.643 6.20648C317.056 2.212 322.796 0 328.749 0L398 0C411.255 0 422 10.7452 422 24V422C422 435.255 411.255 446 398 446H24C10.7452 446 0 435.255 0 422L0 53.417C0 40.1622 10.7452 29.417 24 29.417H277.751Z"
          />
          <foreignObject x="20" y="0" width="406" height="470">
            <div
              dir="rtl"
              className="flex items-center justify-center h-full text-text-about text-[20px] sm:text-xl md:text-xl lg:text-[22px] text-center px-2 sm:px-4 leading-relaxed"
            >
              {t("centerCardText")}
            </div>
          </foreignObject>
        </svg>
      </svg>
    );
  };

  return (
    <div className=" text-foreground px-8">
      <div className="flex justify-center items-center gap-2 py-4 text-primary">
        <Image
          src={arrow}
          className="w-16 h-16 rotate-180 text-primary hidden dark:inline"
          alt="arrow"
        />
        <div className="flex gap-1 rotate-180 justify-center items-center dark:hidden">
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
        <span className="text-sm">{t("aboutUs")}</span>
        <div className="flex gap-1 justify-center items-center dark:hidden">
          <svg
            width="48"
            height="17"
            viewBox="0 0 48 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M45 10.1598C46.3333 9.38998 46.3333 7.46548 45 6.69568L39 3.23158C37.6667 2.46178 36 3.42403 36 4.96363L36 11.8918C36 13.4314 37.6667 14.3937 39 13.6239L45 10.1598Z"
              className="fill-primary"
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
        <Image
          src={arrow}
          className="w-16 h-16 text-primary hidden dark:inline"
          alt="arrow"
        />
      </div>

      <h1 className="text-center md:text-3xl text-xl font-bold mb-4 text-foreground">
        {t("knowDelta")}
      </h1>

      <p className="text-center md:text-base text-sm md:mb-8 mb-12 mx-auto max-w-full font-sans break-words">
        {t("deltaTeam")}
      </p>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col min-[540px]:flex-row justify-center gap-4">
          <div className="w-full min-[540px]:w-1/3 flex flex-col gap-0">
            <CustomCard
              icon={<HomeIcon className="text-iconsecendary  w-10 h-10" />}
              title={t("activeHouses")}
              description={t("activeHousesDesc")}
              image={productMangment}
              useBlueFill={true}
            />

            <CustomCard
              icon={<TrophyIcon className="text-iconsecendary w-10 h-10" />}
              title={t("yearsOfExperience")}
              description={t("yearsOfExperienceDesc")}
              image={Jam}
            />
          </div>

          <div className="w-full min-[540px]:w-1/3 flex justify-center items-center">
            <CenterCard />
          </div>

          <div className="w-full min-[540px]:w-1/3 flex flex-col gap-0">
            <CustomCard
              icon={<ClockIcon className="text-iconsecendary  w-10 h-10" />}
              title={t("supportHours")}
              description={t("supportHoursDesc")}
              image={Speaker}
            />

            <CustomCard
              icon={<SmileIcon className="text-iconsecendary  w-10 h-10" />}
              title={t("userReviews")}
              description={t("userReviewsDesc")}
              image={Love}
              useBlueFill={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
