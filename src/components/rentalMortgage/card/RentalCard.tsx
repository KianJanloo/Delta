/* eslint-disable */
"use client";
import React, { FC } from "react";
import { MapPin, Star, Hotel, Bed, Car, Bath, Heart } from "lucide-react";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import { IHouse } from "@/types/houses-type/house-type";
import { SplitNumber } from "@/utils/helper/spliter/SplitNumber";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

interface IReserveContent {
  items: IHouse;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const RentalCard: FC<IReserveContent> = ({ items, onFavorite, isFavorite }) => {
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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col w-full overflow-hidden rounded-2xl group bg-secondary-light2 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20"
    >
      {/* Image Section */}
      <div className="relative w-full h-[200px] md:h-[240px] flex-shrink-0">
        <div className="relative overflow-hidden w-full h-full">
          <img
            alt={items.title}
            src={items.photos !== null ? items.photos[0] : "/placeholder-property.jpg"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              className="absolute top-3 left-3 bg-danger text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg z-10"
            >
              {discountPercent}% تخفیف
            </motion.div>
          )}

          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavorite(items.id);
              }}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
              aria-label="Add to favorites"
            >
              <Heart
                size={20}
                className={`transition-colors duration-200 ${
                  isFavorite ? "fill-danger text-danger" : "text-gray-600"
                }`}
              />
            </button>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-3 right-3 bg-accent/95 backdrop-blur-sm text-white text-sm flex gap-1.5 items-center px-3 py-1.5 rounded-lg shadow-md">
            <Star size={14} className="fill-current" />
            <span className="font-semibold">{items.rate || 0}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 gap-4">
        {/* Details */}
        <div className="flex flex-col gap-3 flex-1">
          <h2 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {items.title}
          </h2>

          <div className="flex items-start gap-2 text-subText text-sm">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <p className="line-clamp-2 flex-1">
              <span className="font-medium">آدرس: </span>
              <span className="text-foreground">{items.address}</span>
            </p>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 text-sm text-foreground">
            <div className="flex items-center gap-1.5 bg-secondary-light3 px-3 py-2 rounded-lg">
              <Bed size={16} className="text-primary" />
              <span className="font-medium">{items.rooms}</span>
              <span className="text-subText">خوابه</span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary-light3 px-3 py-2 rounded-lg">
              <Car size={16} className="text-primary" />
              <span className="font-medium">{items.parking}</span>
              <span className="text-subText">پارکینگ</span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary-light3 px-3 py-2 rounded-lg">
              <Bath size={16} className="text-primary" />
              <span className="font-medium">{items.bathrooms}</span>
              <span className="text-subText">حمام</span>
            </div>
          </div>
        </div>

        {/* Price and CTA Section */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-secondary-light3">
          {/* Price */}
          <div className="flex flex-col gap-1">
            {hasDiscount ? (
              <>
                <span className="text-subText text-xs line-through">
                  {SplitNumber(items.price)} ت
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-primary text-xl lg:text-2xl font-bold">
                    {SplitNumber(items.discounted_price)}
                  </span>
                  <span className="text-primary text-sm font-medium">تومان</span>
                </div>
              </>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-primary text-xl lg:text-2xl font-bold">
                  {SplitNumber(items.price)}
                </span>
                <span className="text-primary text-sm font-medium">تومان</span>
              </div>
            )}
            <span className="text-xs text-subText">هر شب</span>
          </div>

          {/* CTA Button */}
          <CommonButton
            onclick={() => redirect(`/rent/${items.id}`)}
            icon={<Hotel size={18} />}
            title="مشاهده"
            classname="flex-row-reverse gap-2 py-2.5 px-5 bg-transparent group-hover:bg-primary text-primary group-hover:text-primary-foreground border-2 border-primary rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 whitespace-nowrap text-sm"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RentalCard;