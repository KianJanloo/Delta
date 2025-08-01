/* eslint-disable */

"use client";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import CommonModal from "@/components/dashboard/modal/CommonModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
import {
  CheckCircle2,
  Coins,
  Delete,
  MapPin,
  MoreHorizontal,
  Text,
} from "lucide-react";
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { IFavorite } from "@/types/favorites-type/favorites-type";
import { removeFavorite } from "@/utils/service/api/favorites/removeFavorite";
import { showToast } from "@/core/toast/toast";

const FavoritesDetail = ({
  favorites,
  setRefetch,
}: {
  favorites: IFavorite[];
  setRefetch: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("dashboardBuyer.favoritesPage");
  const [openModalIndex, setOpenModalIndex] = React.useState<number | null>(
    null
  );
  const moreRef = useRef<HTMLTableCellElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setOpenModalIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteFavorite = async (id: number) => {
    const response = await removeFavorite(id);
    if (response) {
      showToast("success", " علاقه مندی با موفقیت از لیست شما حذف شد. ");
    }
  };

  return (
    <Fragment>
      <Table className="text-right max-lg:hidden w-full">
        <TableHeader className="bg-subBg2 rounded-t-2xl text-foreground">
          <TableRow className="text-right">
            <TableHead className="text-right text-foreground">
              {t("hotelName")}
            </TableHead>
            <TableHead className="text-right text-foreground">
              {t("totalPrice")}
            </TableHead>
            <TableHead className="text-right text-foreground">
              {t("address")}
            </TableHead>
            <TableHead className="text-right text-foreground"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {favorites.map((favorite, idx) => (
            <TableRow key={idx}>
              <TableCell className="py-4 whitespace-nowrap flex gap-2 items-center">
                <img
                  src={
                    favorite.house.photos !== null
                      ? favorite.house.photos[0]
                      : " "
                  }
                  alt=""
                  className="rounded-[12px] w-[107px] h-[78px] bg-card-light"
                />
                {favorite.house.title}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {SplitNumber(favorite.house.price)} {t("currency")}
              </TableCell>
              <TableCell className="truncate">
                {favorite.house.address}
              </TableCell>
              <TableCell
                className="relative"
                ref={idx === openModalIndex ? moreRef : null}
              >
                <MoreHorizontal
                  onClick={() => {
                    setOpenModalIndex((prev) => (prev === idx ? null : idx));
                  }}
                  className="cursor-pointer"
                />
                {openModalIndex === idx && (
                  <div
                    className={`flex absolute left-full ${
                      idx > 1 ? "bottom-0" : "top-0"
                    } flex-col backdrop-blur-md border rounded-xl gap-2 p-2 z-20 shadow-2xl`}
                  >
                    <CommonModal
                      handleClick={t("reserve")}
                      title={t("reserveConfirm")}
                      onClick={() => redirect(`/reserve/reserve-house/${favorite.id}`)}
                      button={
                        <div className="px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2">
                          {t("reserve")} <CheckCircle2 size={16} />
                        </div>
                      }
                    />
                    <CommonModal
                      handleClick={t("delete")}
                      title={t("deleteConfirm")}
                      onClick={() => {
                        setRefetch(true);
                        deleteFavorite(favorite.id);
                      }}
                      button={
                        <div className="px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2">
                          {t("delete")} <Delete size={16} />
                        </div>
                      }
                    />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-4 w-full lg:hidden">
        {favorites.map((favorite, idx) => (
          <div
            key={idx}
            className="w-full max-sm:flex-col bg-subBg2 px-4 py-4 rounded-xl flex gap-4"
          >
            <img
              src={
                favorite.house.photos !== null ? favorite.house.photos[0] : " "
              }
              alt=" "
              className=" min-h-full w-[200px] max-sm:w-full max-sm:h-[200px] bg-card rounded-[12px]"
            />
            <div className=" h-full flex flex-col gap-2 max-sm:gap-4 text-base">
              <div className="flex gap-4 items-center flex-wrap">
                <Text className="text-subText" size={20} />
                <p className="text-subText">{t("hotelName")} :</p>
                <span> {favorite.house.title} </span>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <Coins className="text-subText" size={20} />
                <p className="text-subText">{t("price")} :</p>
                <span className="gap-2 flex">
                  {SplitNumber(favorite.house.price)} <p>{t("currency")}</p>
                </span>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <MapPin className="text-subText" size={20} />
                <p className="text-subText">{t("address")} :</p>
                <span className="truncate"> {favorite.house.address} </span>
              </div>
              <CommonButton
                onclick={() => {
                  setRefetch(true);
                  deleteFavorite(favorite.id);
                }}
                classname="w-full bg-danger text-accent-foreground"
                title={t("delete")}
              />
              <CommonButton classname="w-full" title={t("reserve")} onclick={() => redirect(`/reserve/reserve-house/${favorite.house_id}`)} />
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default FavoritesDetail;
