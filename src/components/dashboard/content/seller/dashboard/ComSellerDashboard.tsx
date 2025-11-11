/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
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
import { Loader, Loader2 } from "lucide-react";

const ComSellerDashboard = () => {
  const [reserves, setReserves] = useState<Booking[]>([]);
  const [dashboard, setDashboard] = useState<IDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession() as any;

  const fetchReserves = async () => {
    setIsLoading(true);
    try {
      const res = await getCustomersBookings(
        session.data?.userInfo?.id,
        1,
        8,
        "created_at",
        "DESC"
      );
      setReserves(res?.bookings || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch reserves", err);
      setIsLoading(false);
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

  if (isLoading)
    return (
      <div className="w-full mx-auto my-[200px]">
        <Loader2 className="animate-spin mx-auto text-primary" size={40} />
      </div>
    );

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
