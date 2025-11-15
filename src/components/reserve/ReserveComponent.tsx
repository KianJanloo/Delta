"use client";
import ReserveContent, {
  MarkerType,
} from "@/components/reserve/content/ReserveContent";
import ReserveFilter from "@/components/reserve/filter/ReserveFilter";
import ReserveHeader from "@/components/reserve/header/ReserveHeader";
import { IHouse } from "@/types/houses-type/house-type";
import { getDistanceFromLatLonInKm } from "@/utils/helper/map/MapIcon";
import { getHouses } from "@/utils/service/api/houses-api";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { showToast } from "@/core/toast/toast";
import { useTranslations } from "next-intl";

const ReserveComponent = () => {
  const t = useTranslations('reserve');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const getParam = (key: string, defaultValue: string | number = "") => {
    try {
      return searchParams.get(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  };
  
  const [search, setSearch] = useState<string>(getParam("search", "") as string);
  const [order, setOrder] = useState<"DESC" | "ASC">((getParam("order", "DESC") as "DESC" | "ASC") || "DESC");
  const [sort, setSort] = useState<string>(getParam("sort", "last_updated") as string);
  const [location, setLocation] = useState<string>(getParam("location", "") as string);
  const [minPrice, setMinPrice] = useState<"" | number>(getParam("minPrice") ? Number(getParam("minPrice")) : "");
  const [maxPrice, setMaxPrice] = useState<number | "">(getParam("maxPrice") ? Number(getParam("maxPrice")) : "");
  const [currentPage, setCurrentPage] = useState<number>(Number(getParam("page", "1")) || 1);
  
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [marker, setMarker] = useState<MarkerType | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const updateURLParams = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (!updates.page && Object.keys(updates).some(k => k !== "page")) {
      params.set("page", "1");
      setCurrentPage(1);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const fetchHouses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHouses(
        "reservation",
        debouncedSearch || "",
        order || "DESC",
        sort || "last_updated",
        location || "",
        "",
        minPrice,
        maxPrice,
        "",
        "",
        "",
        "",
        "",
        "",
        currentPage,
        4
      );
      setHouses(response.houses);
      setTotalCount(response.totalCount);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در دریافت اطلاعات";
      setError(errorMessage);
      showToast("error", t("content.errorTitle") || "خطا", undefined, t("content.errorMessage") || "در دریافت اطلاعات مشکلی پیش آمد. لطفا دوباره تلاش کنید.");
      console.error("Error fetching houses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, order, sort, location, minPrice, maxPrice, currentPage, t]);

  const filteredHouses = useMemo(() => {
    if (!marker) {
      return houses;
    }
    const radius = 10;
    return houses.filter((house) => {
      if (!house.location) return false;
      const lat = house.location.lat;
      const lng = house.location.lng;
      const distance = getDistanceFromLatLonInKm(
        marker.lat,
        marker.lng,
        lat,
        lng
      );
      return distance <= radius;
    });
  }, [marker, houses]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  useEffect(() => {
    updateURLParams({ search: debouncedSearch });
  }, [debouncedSearch, updateURLParams]);

  useEffect(() => {
    updateURLParams({ order, sort, location, minPrice, maxPrice });
  }, [order, sort, location, minPrice, maxPrice, updateURLParams]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateURLParams({ page });
    const itemsElement = document.getElementById('items');
    if (itemsElement) {
      itemsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [updateURLParams]);

  return (
    <div className="px-8 mt-[120px] flex flex-col gap-4">
      <ReserveHeader />
      <ReserveFilter
        marker={marker}
        setMarker={setMarker}
        setOrder={setOrder}
        setSort={setSort}
        setSearch={setSearch}
        search={search}
        houseLength={filteredHouses.length}
        setLocation={setLocation}
        location={location}
      />
      <ReserveContent
        totalCount={totalCount}
        marker={marker}
        setMarker={setMarker}
        isLoading={isLoading}
        houses={filteredHouses}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
        setLocation={setLocation}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        error={error}
      />
    </div>
  );
};

export default ReserveComponent;
