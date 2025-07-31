"use client";

import React, { useCallback, useEffect, useState } from "react";
import MiniCard from "../../dashboard/cards/MiniCard";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
import {
  getDashboardFinance,
  IDashboardFinance,
} from "@/utils/service/api/notifications/seller-finance/getDashboardFinance";

const PaymentHeader = () => {
  const [dashboardFinance, setDashboardFinance] = useState<IDashboardFinance>();

  const fetchDashboardFinance = useCallback(async () => {
    const dashboardFinance = await getDashboardFinance();
    setDashboardFinance(dashboardFinance);
  }, []);

  useEffect(() => {
    fetchDashboardFinance();
  }, [fetchDashboardFinance]);

  const dataMiniCards = [
    {
      value: dashboardFinance?.totalCurrentMonthAmount,
      title: " درآمد این ماه ",
      curr: " تومن ",
    },
    {
      value: dashboardFinance?.totalPerviousMonthAmount,
      title: " درآمد ماه قبل ",
      curr: " تومن ",
    },
    {
      value: dashboardFinance?.totalAmount,
      title: " درآمد کل ",
      curr: " تومن ",
    },

    {
      value: dashboardFinance?.totalPayments,
      title: " تعداد پرداختی ها ",
      curr: " تا ",
    },
  ];

  return (
    <div className="w-full max-lg:flex-col flex flex-row gap-4 justify-between ">
      {dataMiniCards.map((data, idx) => (
        <MiniCard
          key={idx}
          {...data}
          idx={idx}
          value={SplitNumber(Number(data.value))}
        />
      ))}
    </div>
  );
};

export default PaymentHeader;
