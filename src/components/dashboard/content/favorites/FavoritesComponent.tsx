/* eslint-disable */

"use client";
import { BlurFade } from "@/components/magicui/blur-fade";
import React, { useCallback, useEffect, useState } from "react";
import FavoritesHeader from "./header/FavoritesHeader";
import FavoritesDetail from "./detail/FavoritesDetail";
import { getCategories } from "@/utils/service/api/categories";
import { Category } from "@/types/categories-type/categories-type";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getFavorites } from "@/utils/service/api/favorites/getFavoritesByUserId";
import { IFavorite } from "@/types/favorites-type/favorites-type";
import { Loader } from "@/components/common/Loader";

export interface IFilters {
  search?: string
}

const FavoritesComponent = () => {
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const limit = 3;
  const [refetch, setRefetch] = useState<boolean>(false);
  const [filters, setFilters] = useState<IFilters>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    const data = {
      page,
      limit,
    };

    let response = await getFavorites(data);
    console.log(response)

    if(filters?.search) {
      response.data = response.data.filter((f) => f.house.title.includes(filters.search || ""))
    }

    if (response) {
      setFavorites(response.data);
      setTotalCount(response.totalCount);
    }

    setRefetch(false);
    setIsLoading(true);
  }, [page, limit, refetch, filters]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) return <div className="mx-auto my-[200px]">
    <Loader />
  </div> 

  return (
    <BlurFade className="px-4 bg-subBg rounded-xl py-4 flex flex-col gap-6">
      <FavoritesHeader
        setFilters={setFilters}
        filters={filters}
      />
      <svg
        width="100%"
        height="1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          y1="0.5"
          x2="100%"
          y2="1"
          stroke="#888888"
          strokeOpacity="0.26"
          strokeDasharray="7 7"
        />
      </svg>
      <FavoritesDetail favorites={favorites} setRefetch={setRefetch} />
      <div className="flex w-full flex-wrap justify-between items-end">
        <div></div>
        <div>
          <Pagination className="w-fit">
            <PaginationContent className="justify-center mt-6">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, idx) => (
                <PaginationItem key={idx + 1}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className={
                      page === idx + 1
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </BlurFade>
  );
};

export default FavoritesComponent;
