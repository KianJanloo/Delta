"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import arrow from "@/assets/arrow.svg";
import { Star, Calendar } from "lucide-react";
import plygen from "@/assets/Polygon 1.png";
import { useTranslations } from "next-intl";
import { getComments } from "@/utils/service/api/comments";
import { ICommentAll } from "@/types/comment-type/comment-type";
import { getPublicProfileById } from "@/utils/service/api/profile/getProfileById";
import { IPublicProfile } from "@/types/profile-type/profile-type";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";

interface CommentCardProps {
  comment: ICommentAll;
  isSmallScreen: boolean;
}

const CommentUsers = () => {
  const t = useTranslations("landing.commentUsers");
  const [activeSlideGroup, setActiveSlideGroup] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [comments, setComments] = useState<ICommentAll[]>([]);

  const fetchComments = async () => {
    const response = await getComments(1, 10, "created_at", "DESC");
    setComments(response.data);
  };

  useEffect(() => {
    fetchComments()
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const commentsPerSlide = isSmallScreen ? 1 : 2;
  const slideGroupsCount = Math.ceil(comments.length / commentsPerSlide);

  const goToNextSlide = () => {
    setActiveSlideGroup((prev) => (prev < slideGroupsCount - 1 ? prev + 1 : 0));
  };

  const goToPrevSlide = () => {
    setActiveSlideGroup((prev) => (prev > 0 ? prev - 1 : slideGroupsCount - 1));
  };

  const goToSlideGroup = (index: number) => {
    setActiveSlideGroup(index);
  };

  const commentPairs = [];
  for (let i = 0; i < comments.length; i += commentsPerSlide) {
    commentPairs.push(comments.slice(i, i + commentsPerSlide));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlideGroup((prev) =>
        prev < slideGroupsCount - 1 ? prev + 1 : 0
      );
    }, 9000);
    return () => clearInterval(interval);
  }, [slideGroupsCount]);

  const sliderPosition = 100 * activeSlideGroup;

  return (
    <div className="text-foreground px-8">
      <div className="flex justify-center items-center gap-2 py-2 sm:py-4 mb-2 sm:mb-4 text-primary">
        <Image
          src={arrow}
          className="w-8 h-8 sm:w-12 sm:h-12 rotate-180 cursor-pointer dark:inline hidden"
          alt="arrow"
          onClick={goToPrevSlide}
        />
        <span className="text-sm sm:text-base md:text-lg" dir="rtl">
          {t("title")}
        </span>
        <Image
          src={arrow}
          className="w-8 h-8 sm:w-12 sm:h-12 cursor-pointer dark:inline hidden"
          alt="arrow"
          onClick={goToNextSlide}
        />
      </div>

      <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" dir="rtl">
        {t("subtitle")}
      </h1>

      <p className="text-center text-xs sm:text-sm md:text-base mb-4 sm:mb-5 mx-auto max-w-2xl font-sans break-words leading-5 sm:leading-6 md:leading-7" dir="rtl">
        {t("description")}
      </p>

      <div className="flex flex-col items-center">
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-all duration-700 ease-in-out"
            style={{ transform: `translateX(${sliderPosition}%)` }}
            dir="rtl"
          >
            {commentPairs.map((pair, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full flex flex-col md:flex-row justify-center items-center md:items-stretch gap-4 md:gap-8"
              >
                {pair.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    isSmallScreen={isSmallScreen}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-6">
          {Array.from({ length: slideGroupsCount }).map((_, index) => (
            <div key={index} onClick={() => goToSlideGroup(index)} className="cursor-pointer">
              {activeSlideGroup === index ? (
                <div>
                  <Image src={plygen} className="dark:inline hidden w-3 h-3 sm:w-4 sm:h-4" alt="active" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary dark:hidden" />
                </div>
              ) : (
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-ring" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommentCard = ({ comment, isSmallScreen }: CommentCardProps) => {
  const [user, setUser] = useState<IPublicProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getPublicProfileById(comment.user_id);
      setUser(userData);
    };
    fetchUser();
  }, [comment.user_id]);

  const trimmedText = isSmallScreen
    ? comment?.caption?.slice(0, 78) + (comment?.caption && comment?.caption?.length > 50 ? "..." : "")
    : comment.caption;

  if (!user) return null;

  return (
    <div className="relative w-[65vw] sm:w-[70vw] md:w-[40vw] lg:w-[40vw] h-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 678 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          className="fill-cardComment"
          d="M554.978 27.4183C562.544 27.4183 569.668 23.8499 574.199 17.7897L580.301 9.62861C584.832 3.56845 591.956 0 599.522 0L654 0C667.255 0 678 10.7452 678 24V285C678 298.255 667.255 309 654 309H24C10.7452 309 0 298.255 0 285L0 51.4183C0 38.1635 10.7452 27.4183 24 27.4183L554.978 27.4183Z"
        />
      </svg>

      <div className="relative z-10 flex flex-col h-full p-4 sm:p-6 md:p-8 lg:p-10 justify-between text-primary-foreground">
        <div className="flex items-center justify-start w-full" dir="rtl">
          <div className="w-10 h-6 sm:w-12 sm:h-7 gap-1 md:w-14 md:h-8 lg:w-16 lg:h-10 flex items-center bg-bacgkroundW justify-center rounded-md">
            <span className="text-textComment text-xs sm:text-sm md:text-base">
              {comment.rating}
            </span>
            <Star className="fill-textComment ml-1 w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>

        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed text-text-about my-2 sm:my-3 md:my-4">
          {trimmedText}
        </p>

        <div className="w-full h-[40px] sm:h-[45px] md:h-[50px] lg:h-[60px] relative mt-auto">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 646 81"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0 w-full h-full rounded-xl"
            preserveAspectRatio="none"
          >
            <rect width="646" height="81" rx="24" className="fill-card-light" />
          </svg>

          <div className="relative z-10 flex items-center h-full px-2 sm:px-3 md:px-4 lg:px-5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-md bg-ring flex items-center justify-center text-primary-foreground text-[10px] sm:text-xs md:text-sm lg:text-base">
              {user.name.charAt(0)}
            </div>
            <div className="text-right mr-2 sm:mr-3 md:mr-4">
              <p className="font-semibold text-[8px] text-text-about sm:text-[10px] md:text-xs lg:text-sm">
                {user.name}
              </p>
              <div className="flex items-center text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-ring mt-0.5">
                <Calendar className="mx-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                <span>{convertToJalaliString(comment.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentUsers;