'use client'
import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { Star, Calendar, ChevronLeft, NotepadText } from "lucide-react";
import { IGetComment, IParentComment } from "@/types/comment-type/comment-type";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getProfileById } from "@/utils/service/api/profile/getProfileById";
import { IProfile } from "@/types/profile-type/profile-type";
import { getCommentById } from "@/utils/service/api/comments";

export const QAWidget: FC<
  IGetComment & {
    setViewReply: Dispatch<SetStateAction<boolean>>;
    setTitle: Dispatch<SetStateAction<string>>;
    setParent_comment_id: Dispatch<SetStateAction<string | null>>;
  }
> = ({
  rating,
  title,
  caption,
  created_at,
  user_id,
  parent_comment_id,
  id,
  setViewReply,
  setTitle,
  setParent_comment_id,
}) => {
    const t = useTranslations('rental.commentItem');
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [user, setUser] = useState<IProfile | null>(null);
    const [parent_comment, setParent_comment] = useState<IParentComment | null>(null);

    const clampStyle: React.CSSProperties = {
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    };

    const getParentComment = useCallback(async () => {
      if (parent_comment_id) {
        const res = await getCommentById(parent_comment_id);
        setParent_comment(res)
      }
    }, [parent_comment_id])

    const getProfile = useCallback(async () => {
      const res = await getProfileById(user_id);
      setUser(res)
    }, [user_id])

    useEffect(() => {
      getProfile()
      getParentComment()
    }, [getProfile, getParentComment])

    return (
      <div
        className="flex h-full justify-between rounded-[32px] flex-col gap-8 bg-secondary-light2 px-4 py-4 pt-[40px] relative group
                  after:content-[''] after:w-[125px] after:h-[70px] after:group-hover:bg-primary
                  after:absolute after:top-[-40px] after:rounded-tr-2xl after:rounded-tl-[40px]
                  after:right-0 after:bg-secondary-light2"
      >
        <div className="absolute z-10 right-3 top-[-25px] w-fit rounded-[16px] px-2 py-1 text-sm bg-white  flex gap-2 items-center text-textComment">
          {rating || 0} {t("star")} <Star size={16} />
        </div>

        <div className="flex gap-2 flex-col">
          <h2 className="text-2xl"> {parent_comment ? parent_comment.title : title} </h2>
          <h2
            className="cursor-pointer text-lg"
            style={!showFullCaption ? clampStyle : undefined}
            onClick={() => setShowFullCaption((prev) => !prev)}
          >
            {parent_comment ? parent_comment.caption : caption || t("emptyMessage")}
          </h2>
        </div>

        <div className="flex gap-4 items-center">
          <div className="bg-accent text-accent-foreground cursor-pointer whitespace-nowrap px-6 py-3 rounded-[16px] flex items-center gap-2 flex-row-reverse">
            {t("userReplies")} <NotepadText size={16} />
          </div>
          <svg
            width="283"
            height="3"
            viewBox="0 0 283 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0.5"
              y1="1.5"
              x2="283"
              y2="1.49998"
              stroke="url(#paint0)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient
                id="paint0"
                x1="283"
                y1="3.5"
                x2="0.5"
                y2="3.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {parent_comment ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <h2>{user?.fullName || t("anonymous")}</h2>|
              <span className="text-xs text-subText flex items-center gap-2">
                <Calendar size={12} />
                {created_at ? convertToJalaliString(created_at) : t("unknownDate")}
              </span>
            </div>

            <div className="flex gap-2 flex-col">
              <h2 className="text-xl"> {title} </h2>
              <h2
                className="cursor-pointer text-lg"
                style={!showFullCaption ? clampStyle : undefined}
                onClick={() => setShowFullCaption((prev) => !prev)}
              >
                {caption || t("emptyMessage")}
              </h2>
            </div>
          </div>
        ) : (
          <span className="mx-auto">{t("noComment")}</span>
        )}

        <div className="bg-card-light rounded-[16px] flex md:flex-row flex-col max-md:items-start items-center justify-between py-2 px-4 gap-4">
          <div className="flex items-center gap-4">
            {user?.profilePicture ? (
              <Image className="bg-cardComment rounded-[16px]" width={57} height={57} alt=" " src={user.profilePicture} />
            ) : (
              <div className="bg-cardComment rounded-[16px] min-w-[57px] min-h-[57px]" />
            )}
            <div className="flex flex-col justify-between gap-3">
              <h2>{user?.fullName || t("anonymous")}</h2>
              <span className="text-sm text-subText flex items-center gap-2">
                <Calendar size={16} /> {convertToJalaliString(parent_comment?.created_at ? parent_comment.created_at : created_at)}
              </span>
            </div>
          </div>
          <div
            onClick={() => {
              setTitle(parent_comment ? (parent_comment.title || "") : title || "");
              setViewReply(true);
              setParent_comment_id(parent_comment_id ? parent_comment_id : id);
            }}
            className="px-4 py-2 whitespace-nowrap cursor-pointer border border-foreground rounded-[16px] flex items-center gap-2 flex-row-reverse"
          >
            <ChevronLeft size={16} /> {t("reply")}
          </div>
        </div>
      </div>
    );
  };