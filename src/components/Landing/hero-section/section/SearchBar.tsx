"use client";
import React, { useState, useRef, useEffect } from "react";
import CommonSelect from "@/components/common/inputs/common/CommonSelect";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import { Coins, Search, X } from "lucide-react";
import CommonInput from "@/components/common/inputs/common/CommonInput";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import CitySelectPopover from "@/components/common/inputs/common/CitySelectPopovar";
import { useTranslations } from "next-intl";

export const selectItems = [
  { label: "همه", value: "all" },
  { label: "آذربایجان شرقی", value: "آذربایجان شرقی" },
  { label: "آذربایجان غربی", value: "آذربایجان غربی" },
  { label: "اردبیل", value: "اردبیل" },
  { label: "اصفهان", value: "اصفهان" },
  { label: "البرز", value: "البرز" },
  { label: "ایلام", value: "ایلام" },
  { label: "بوشهر", value: "بوشهر" },
  { label: "تهران", value: "تهران" },
  { label: "چهارمحال و بختیاری", value: "چهارمحال و بختیاری" },
  { label: "خراسان جنوبی", value: "خراسان جنوبی" },
  { label: "خراسان رضوی", value: "خراسان رضوی" },
  { label: "خراسان شمالی", value: "خراسان شمالی" },
  { label: "خوزستان", value: "خوزستان" },
  { label: "زنجان", value: "زنجان" },
  { label: "سمنان", value: "سمنان" },
  { label: "سیستان و بلوچستان", value: "سیستان و بلوچستان" },
  { label: "فارس", value: "فارس" },
  { label: "قزوین", value: "قزوین" },
  { label: "قم", value: "قم" },
  { label: "کردستان", value: "کردستان" },
  { label: "کرمان", value: "کرمان" },
  { label: "کرمانشاه", value: "کرمانشاه" },
  { label: "کهگیلویه و بویراحمد", value: "کهگیلویه و بویراحمد" },
  { label: "گلستان", value: "گلستان" },
  { label: "گیلان", value: "گیلان" },
  { label: "لرستان", value: "لرستان" },
  { label: "مازندران", value: "مازندران" },
  { label: "مرکزی", value: "مرکزی" },
  { label: "هرمزگان", value: "هرمزگان" },
  { label: "همدان", value: "همدان" },
  { label: "یزد", value: "یزد" },
];

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [transactionType, setTransactionType] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const t = useTranslations("landing.heroSection");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (transactionType) params.set("transactionType", transactionType);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    router.push(`/rent?${params.toString()}`);
  };

  return (
    <div className="absolute -bottom-5 lg:bottom-8 md:bottom-2 left-0 right-0 mx-auto w-full max-w-5xl z-50 px-4">
      <div className="md:hidden flex justify-center mt-10 items-center gap-2 ">
        <CommonButton
          onclick={() => setIsOpen(true)}
          title={t("searchButtonSubTitle")}
          classname={`bg-primary text-secondary p-2 text-xs rounded-xl ${isOpen ? "hidden" : "flex"}`}
          type="button"
          icon={<Search size={12} />}
        />
      </div>
      <div
        ref={searchRef}
        className={`flex justify-between items-center w-full bg-subBg backdrop-blur-sm rounded-[32px] p-4 transition-all duration-300 ${isOpen ? "h-auto opacity-100" : "h-0 overflow-visible md:h-auto"} ${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className={`md:hidden absolute top-2 left-2 text-subText ${isOpen ? "block" : "hidden"}`}
        >
          <X size={20} />
        </button>

        <div
          className={`flex-1 flex flex-col md:flex-row items-center justify-around gap-4 w-full ${isOpen ? "block" : "hidden md:flex"}`}
        >
          <div className="w-full md:w-auto flex-col flex gap-1">
            <Label className={`text-[13px] flex gap-0.5 text-subText`}>
              <span> {t("searchBar.firstInput.label")} </span>
              <span> : </span>
            </Label>
            <CitySelectPopover
              value={value}
              onChange={(val) => {
                setValue(val);
                setLocation(val === "همه" ? "" : val);
              }}
              items={selectItems}
              placeholder={t("searchBar.firstInput.placeholder")}
            />
          </div>

          <div className="w-full md:w-auto">
            <CommonSelect
              onValueChange={(value) => {
                setTransactionType(value === "all" ? "" : value);
              }}
              placeholder={t("searchBar.secondInput.placeholder")}
              icon={<Coins size={16} className="text-subText" />}
              selectItems={[
                { label: t("searchBar.secondInput.options.mortgage"), value: "mortgage" },
                { label: t("searchBar.secondInput.options.rental"), value: "rental" },
                { label: t("searchBar.secondInput.options.direct_purchase"), value: "direct_purchase" },
                { label: t("searchBar.secondInput.options.all"), value: "all" },
              ]}
              color="text-subText"
              label={t("searchBar.secondInput.label")}
              classname="px-4 py-5 border-subText w-full"
            />
          </div>

          <div className="w-full md:w-auto">
            <CommonInput
              onchange={(e) => setMinArea(e.target.value)}
              label={t("searchBar.thirdInput.label")}
              classname="px-4 py-2 border-subText w-full outline-none"
              color="text-subText placeholder:text-subText"
              placeholder={t("searchBar.thirdInput.placeholder")}
              type="number"
            />
          </div>

          <div className="w-full md:w-auto">
            <CommonInput
              onchange={(e) => setMaxArea(e.target.value)}
              label={t("searchBar.fourthInput.label")}
              classname="px-4 py-2 border-subText w-full outline-none"
              color="text-subText placeholder:text-subText"
              placeholder={t("searchBar.fourthInput.placeholder")}
              type="number"
            />
          </div>

          <div className="w-full md:w-auto">
            <CommonButton
              onclick={handleClick}
              title={t("searchButtonTitle")}
              classname="px-8 py-7 text-sm font-bold w-full overflow-hidden text-primary-foreground"
              type="button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;