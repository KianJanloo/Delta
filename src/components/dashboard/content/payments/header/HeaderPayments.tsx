import CommonSelect from "@/components/common/inputs/common/CommonSelect";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";

const HeaderPayments = ({
  setFilters,
  filters,
}: {
  filters: { status: string };
  setFilters: Dispatch<SetStateAction<{ status: string }>>;
}) => {
  const t = useTranslations("dashboardBuyer.payments");
  return (
    <div className="flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center">
      <h2 className="text-xl max-lg:text-base">{t("title")}</h2>
      <div className="flex gap-4 md:w-fit w-full">
        <CommonSelect
          label={t("paymentStatus")}
          placeholder={t("paymentStatusPlaceholder")}
          onValueChange={(val) =>
            val === "all"
              ? setFilters({ ...filters, status: "" })
              : setFilters({ ...filters, status: val })
          }
          selectItems={[
            { value: "all", label: " همه " },
            { value: "pending", label: " در حال انتظار " },
            { value: "completed", label: " تایید شده " },
            { value: "failed", label: " لغو شده " },
          ]}
          classname="border px-8 border-subText py-5"
        />
      </div>
    </div>
  );
};

export default HeaderPayments;
