/* eslint-disable */

"use client";
import React, { FC } from "react";
import { MapPin, Star, Hotel, Bed, Car, Bath } from "lucide-react";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import { IHouse } from "@/types/houses-type/house-type";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

interface IReserveContent {
  items: IHouse;
}

const RentalCard: FC<IReserveContent> = ({ items }) => {
  const hasDiscount =
    items.discounted_price && items.discounted_price < items.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(items.price) - Number(items.discounted_price)) /
          Number(items.price)) *
          100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col gap-4 xl:flex-row lg:basis-[calc(50%-1rem)] basis-full overflow-hidden px-4 max-lg:px-2 py-2 rounded-[16px] group justify-between bg-secondary-light2"
    >
      <div className="flex flex-col overflow-hidden lg:flex-row gap-4 max-lg:w-full w-fit">
        <img
          alt=" "
          src={items.photos !== null ? items.photos[0] : " "}
          className="bg-secondary-light3 w-[388px] h-[144px] max-lg:w-full max-lg:h-[200px] object-cover group-hover:shadow-[#8CFF451F] group-hover:shadow-2md group-hover:border group-hover:border-primary rounded-[16px]"
        />
        <div className="flex flex-col gap-4 items-start justify-between w-full">
          <div className="bg-accent text-white text-sm flex gap-2 px-4 py-1 flex-row-reverse rounded-[8px]">
            <span>{items.rate || 0} ستاره</span>
            <Star size={16} />
          </div>
          <h2 className="text-lg lg:text-2xl"> {items.title} </h2>
          <p className="flex text-subText truncate gap-1 w-full">
            <span className="flex gap-2 items-center">
              <MapPin size={16} />
              <span>آدرس:</span>
            </span>
            <span className="text-foreground truncate">{items.address}</span>
          </p>
          <p className="flex gap-2 text-sm truncate items-center">
            <span className="flex gap-2 flex-row-reverse">
              {" "}
              {items.rooms} خوابه <Bed size={16} />{" "}
            </span>
            |
            <span className="flex gap-2 flex-row-reverse">
              {" "}
              {items.parking} پارکینگ <Car size={16} />{" "}
            </span>
            |
            <span className="flex gap-2 flex-row-reverse">
              {" "}
              {items.bathrooms} حمام <Bath size={16} />{" "}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-4 items-center w-fit max-xl:w-full">
        {hasDiscount ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-danger text-sm line-through">
              {SplitNumber(items.price)} ت
            </span>
            <span className="text-primary text-lg md:text-xl font-bold">
              {SplitNumber(items.discounted_price)} ت
            </span>
            <span className="bg-danger text-accent-foreground text-xs px-2 py-0.5 rounded-md">
              {discountPercent}% تخفیف
            </span>
          </div>
        ) : (
          <span className="text-primary text-lg md:text-2xl">
            {SplitNumber(items.price)} ت
          </span>
        )}

        <CommonButton
          onclick={() => redirect(`/rent/${items.id}`)}
          icon={<Hotel />}
          title="بررسی بیشتر"
          classname="flex-row-reverse py-3 md:py-5 bg-transparent group-hover:bg-primary text-primary group-hover:text-primary-foreground border border-primary w-full xl:w-auto"
        />
      </div>
    </motion.div>
  );
};

export default RentalCard;
