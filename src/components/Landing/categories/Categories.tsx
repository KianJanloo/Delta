/* eslint-disable */

"use client";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import villaIcon from "../../../assets/images/categories/house.png";
import villaIcon2 from "../../../assets/images/categories/cottage.png";
import villaIcon3 from "../../../assets/images/categories/wooden-house.png";
import villaIcon4 from "../../../assets/images/categories/apartment.png";
import star from "@/assets/Star 7.png";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Loader } from "@/components/common/Loader";
import arrow from "@/assets/arrow.svg";
import { useRouter } from "next/navigation";
import { Category } from "@/types/categories-type/categories-type";
import { getCategories } from "@/utils/service/api/categories";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons = [villaIcon4, villaIcon2, villaIcon, villaIcon3];

const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("landing.categories");
  const router = useRouter();

  // Responsive cards calculation
  const cardsToShow = useMemo(() => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width >= 1346) return 6;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    if (width >= 450) return 2;
    return 1;
  }, []);

  const [visibleCards, setVisibleCards] = useState(cardsToShow);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const Data = await getCategories();
        setCategoryData(Data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateCardsToShow = () => {
      const width = window.innerWidth;
      if (width >= 1346) setVisibleCards(6);
      else if (width >= 1024) setVisibleCards(4);
      else if (width >= 768) setVisibleCards(3);
      else if (width >= 450) setVisibleCards(2);
      else setVisibleCards(1);
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => 
      categoryData.length === 0 ? 0 : (prev + 1) % categoryData.length
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => 
      categoryData.length === 0 ? 0 : (prev - 1 + categoryData.length) % categoryData.length
    );
  };

  const displayedCards = useMemo(() => {
    return Array.from({
      length: Math.min(visibleCards, categoryData.length),
    }).map((_, idx) => ({
      index: (currentSlide + idx) % categoryData.length,
      category: categoryData[(currentSlide + idx) % categoryData.length],
      icon: categoryIcons[((currentSlide + idx) % categoryData.length) % categoryIcons.length]
    }));
  }, [currentSlide, visibleCards, categoryData]);

  const handleCategoryClick = (type: string) => {
    const params = new URLSearchParams();
    params.set("propertyType", type);
    router.push(`/rent?${params.toString()}`);
  };

  const canNavigate = categoryData.length > visibleCards;

  return (
    <div className="text-foreground py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div>
              <Image
                src={arrow}
                alt="arrow"
                className="w-8 h-8 sm:w-10 rotate-180 sm:h-10 brightness-0 dark:brightness-100 transition-all duration-300"
              />
            </div>
            <span className="text-primary text-sm sm:text-base md:text-lg font-semibold uppercase tracking-wide">
              {t("title")}
            </span>
            <div>
              <Image
                src={arrow}
                alt="arrow"
                className="w-8 h-8 sm:w-10 sm:h-10 brightness-0 dark:brightness-100 transition-all duration-300"
              />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {t("headline")}
          </h2>

          <p className="text-subText text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader />
            </div>
          ) : categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-subText">
              <Sparkles size={48} className="mb-4 opacity-50" />
              <p>{t("noCategories") || "هیچ دسته‌بندی موجود نیست"}</p>
            </div>
          ) : (
            <div className="relative px-12 sm:px-16">
              {/* Navigation Buttons */}
              {canNavigate && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-secondary-light2 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border border-secondary-light3 group"
                    aria-label="Previous category"
                  >
                    <ChevronLeft 
                      size={24} 
                      className="text-primary group-hover:text-primary/80 transition-colors" 
                    />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-secondary-light2 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border border-secondary-light3 group"
                    aria-label="Next category"
                  >
                    <ChevronRight
                      size={24} 
                      className="text-primary group-hover:text-primary/80 transition-colors" 
                    />
                  </button>
                </>
              )}

              {/* Cards Container */}
              <div className="overflow-hidden">
                <div className="flex gap-4 lg:gap-6 justify-center items-center">
                  <AnimatePresence mode="popLayout">
                    {displayedCards.map(({ index, category, icon }) => (
                      <motion.div
                        key={`${index}-${category.name}`}
                        initial={{ opacity: 0, scale: 0.8, x: 100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -100 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex-shrink-0"
                        style={{ 
                          width: `calc((100% - ${(visibleCards - 1) * 1.5}rem) / ${visibleCards})`,
                          minWidth: '180px',
                          maxWidth: '240px'
                        }}
                      >
                        <CategoryCard
                          category={category}
                          icon={icon}
                          isHovered={hoveredIndex === index}
                          onHoverStart={() => setHoveredIndex(index)}
                          onHoverEnd={() => setHoveredIndex(null)}
                          onClick={() => handleCategoryClick(category.name)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        {!isLoading && canNavigate && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(categoryData.length / visibleCards) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx * visibleCards)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentSlide / visibleCards) === idx
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-secondary-light3 hover:bg-secondary-light4'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Separate CategoryCard Component
interface CategoryCardProps {
  category: Category;
  icon: any;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick
}) => {
  return (
    <motion.div
      className="relative h-[160px] sm:h-[180px] cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Background */}
      <div 
        onClick={onClick}
        className={`
          w-full h-full rounded-2xl overflow-hidden
          transition-all duration-300
          ${isHovered 
            ? 'bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30' 
            : 'bg-white dark:bg-secondary-light2 shadow-md hover:shadow-lg'
          }
          border-2 ${isHovered ? 'border-primary' : 'border-transparent dark:border-secondary-light3'}
        `}
      >
        {/* Decorative Pattern */}
        <div className={`absolute inset-0 opacity-5 ${isHovered ? 'opacity-10' : ''} transition-opacity duration-300`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-between p-4 sm:p-6">
          {/* Icon */}
          <motion.div
            className={`
              w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center
              transition-all duration-300
              ${isHovered 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-secondary-light2 dark:bg-secondary-light3'
              }
            `}
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Image
              alt={category.name}
              src={icon}
              className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 ${
                isHovered ? 'invert-0 brightness-0 invert' : 'invert dark:invert-0'
              }`}
            />
          </motion.div>

          {/* Category Name */}
          <div className="flex items-center gap-2">
            <Image
              alt="star"
              src={star}
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                isHovered ? 'invert-0 dark:invert' : 'invert dark:invert-0'
              }`}
            />
            <span
              className={`
                text-sm sm:text-base font-bold text-center transition-all duration-300
                ${isHovered ? 'text-white scale-105' : 'text-foreground'}
              `}
            >
              {category?.name || "دسته‌بندی"}
            </span>
            <Image
              alt="star"
              src={star}
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                isHovered ? 'invert-0 dark:invert' : 'invert dark:invert-0'
              }`}
            />
          </div>

          {/* Hover Effect Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-white"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Categories;