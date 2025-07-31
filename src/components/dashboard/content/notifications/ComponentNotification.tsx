/* eslint-disable */

"use client";

import React, { useCallback, useEffect, useState } from "react";
import HeaderNotifications from "./header/HeaderNotifications";
import ContentNotifications from "./content/ContentNotifications";
import { BlurFade } from "@/components/magicui/blur-fade";
import {
  getNotifications,
  INotification,
} from "@/utils/service/api/notifications/getNotifications";
import { useSession } from "next-auth/react";
import { markAllAsRead } from "@/utils/service/api/notifications/markAsRead";
import { showToast } from "@/core/toast/toast";

const ComponentNotification = () => {
  const session = useSession() as any;

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const limit = 5;
  const totalPages = totalCount / limit;
  const [refetch, setRefetch] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const data = {
      page,
      limit,
      type,
    };

    const response = await getNotifications(session.data?.userInfo?.id, data);
    if (response) {
      setNotifications(response.data);
      setTotalCount(response.totalCount);
      setRefetch(false);
    }
    setLoading(false);
  }, [session.data?.userInfo?.id, page, refetch, type]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAll = useCallback(async () => {
    const response = await markAllAsRead();
    if (response) {
      showToast("success", " تمام اعلان های شما خوانده شدند. ");
      setPage(1);
    }
  }, [setPage]);

  return (
    <BlurFade className="px-4 bg-subBg rounded-xl py-4 flex flex-col gap-8">
      <HeaderNotifications
        markAll={markAll}
        setRefetch={setRefetch}
        setType={setType}
      />
      <svg
        width="100%"
        height="2"
        viewBox="0 0 1131 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="-0.00439453"
          y1="0.881836"
          x2="1131"
          y2="0.881836"
          stroke="#888888"
          strokeOpacity="0.26"
          strokeDasharray="7 7"
        />
      </svg>
      <ContentNotifications
        notifications={notifications}
        totalCount={totalCount}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setRefetch={setRefetch}
        loading={loading}
      />
    </BlurFade>
  );
};

export default ComponentNotification;
