/* eslint-disable */
import CommonInput from "@/components/common/inputs/common/CommonInput";
import FilterModalPayment from "@/components/dashboard/modal/FilterModalPayment";
import { Category } from "@/types/categories-type/categories-type";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import { IFilters } from "../FavoritesComponent";

interface FavoritesHeaderProps {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
}

const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({
  filters,
  setFilters,
}) => {
  const t = useTranslations("dashboardBuyer.favoritesPage");

  return (
    <div className="flex w-full max-md:flex-col gap-4 justify-between items-start md:items-center">
      <h2>{t("title")}</h2>
      <div className="flex gap-4 max-md:flex-col md:w-fit w-full items-end">
        <div className="relative flex items-center max-md:w-full">
          <CommonInput
            onchange={(e) => setFilters({ ...filters, search: e.target.value })}
            value={filters.search}
            classname="text-subText placeholder:subText border-subText md:w-[400px] w-full"
            color="text-subText"
            label={t("searchLabel")}
            placeholder={t("searchPlaceholder")}
          />
        </div>
      </div>
    </div>
  );
};

export default FavoritesHeader;
