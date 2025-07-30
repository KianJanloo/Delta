/* eslint-disable */

"use client";

import { useCallback, useEffect, useState } from "react";
import StatusProfile from "./cards/StatusProfile";
import SituationPayroll from "./cards/SituationPayroll";
import RecentReserves from "./cards/RecentReserves";
import { getDashboardSummary } from "@/utils/service/api/dashboard/getDashboardSummary";
import { IDashboardSummary } from "@/types/dashboard-type/summary-type/summary-type";
import {
  Booking,
  getCustomersBookings,
} from "@/utils/service/api/booking/getCustomersBookings";
import MiniCard from "./cards/MiniCard";
import { useSession } from "next-auth/react";

const ComSellerDashboard = () => {
  const [reserves, setReserves] = useState<Booking[]>([]);
  const [dashboard, setDashboard] = useState<IDashboardSummary | null>(null);

  const session = useSession() as any;

  const fetchReserves = async () => {
    try {
      const res = await getCustomersBookings(
        session.data?.userInfo?.id,
        1,
        8,
        "created_at",
        "DESC"
      );
      setReserves(res?.bookings || []);
      console.log(res)
    } catch (err) {
      console.error("Failed to fetch reserves", err);
    }
  };

  useEffect(() => {
    fetchReserves();
  }, [session.data?.userInfo?.id]);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardSummary();
      setDashboard(res);
    } catch (err) {
      console.error("Failed to fetch reserves", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const dataMiniCards = [
    {
      number: dashboard?.houses,
      title: " تعداد املاک ",
      href: "/dashboard/seller/manage-houses/my-houses",
    },
    {
      number: dashboard?.bookings.conformedBookings,
      title: " رزرو های تایید شده ",
      href: "/dashboard/seller/manage-reserves",
    },
    {
      number: dashboard?.bookings.pendingBookings,
      title: " رزرو های در حال انتظار ",
      href: "/dashboard/seller/manage-reserves",
    },
    {
      number: dashboard?.comments,
      title: " تعداد نظرات ",
      href: "/dashboard/seller/manage-comments",
    },
  ];

  return (
    <div className="bg-bgDash rounded-xl py-4 flex flex-col gap-8">
      <div className="w-full max-lg:flex-col flex flex-row gap-4 justify-between">
        {dataMiniCards.map((data, idx) => (
          <MiniCard key={idx} {...data} idx={idx} />
        ))}
      </div>
      <div className="flex w-full justify-between gap-4 h-fit max-lg:flex-col">
        <SituationPayroll />
        <StatusProfile />
      </div>
      <RecentReserves reserves={reserves} />
    </div>
  );
};

export default ComSellerDashboard;
