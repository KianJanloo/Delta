/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { BlurFade } from "@/components/magicui/blur-fade";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getComments, IComment } from "@/utils/service/api/comments/getComments";
import { 
  Search, 
  Star, 
  Trash2, 
  X, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Award,
  BarChart3,
  Filter
} from "lucide-react";
import { deleteComment } from "@/utils/service/api/comments/deleteComment";
import { showToast } from "@/core/toast/toast";
import { Button } from "@/components/ui/button";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";
import { useTranslations } from "next-intl";
import CommonSelect from "@/components/common/inputs/common/CommonSelect";
import { Input } from "@/components/ui/input";
import { getMyHouses } from "@/utils/service/api/houses/getMyHouses";
import { IHouse } from "@/types/houses-type/house-type";
import { useSession } from "next-auth/react";
import CommonModal from "@/components/dashboard/modal/CommonModal";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManageCommentsComponent = () => {
  const t = useTranslations("dashboardSeller.manageComments");
  const { data: session } = useSession() as any;
  
  const [comments, setComments] = useState<IComment[]>([]);
  const [filteredComments, setFilteredComments] = useState<IComment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [houses, setHouses] = useState<IHouse[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [houseFilter, setHouseFilter] = useState<string>("all");

  // Fetch seller's houses
  const fetchHouses = useCallback(async () => {
    if (session?.userInfo?.id) {
      try {
        const response = await getMyHouses({ page: 1, limit: 1000 });
        setHouses(response?.houses || []);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    }
  }, [session?.userInfo?.id]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all comments without pagination initially
      const response = await getComments({
        page: 1,
        limit: 1000,
        sort: "createdAt",
        order: "DESC",
      });
      setComments(response.data);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Apply filters
  useEffect(() => {
    let filtered = [...comments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (comment) =>
          comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${comment.user.firstName} ${comment.user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter((comment) => comment.rating === rating);
    }

    // House filter
    if (houseFilter !== "all") {
      filtered = filtered.filter(
        (comment) => comment.houseId.toString() === houseFilter
      );
    }

    setFilteredComments(filtered);
    setTotalCount(filtered.length);
  }, [comments, searchTerm, ratingFilter, houseFilter]);

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      showToast("success", t("deleteSuccess"));
      fetchComments();
    } catch (error) {
      showToast("error", t("deleteError"));
      console.error("Error deleting comment:", error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setRatingFilter("all");
    setHouseFilter("all");
    setPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" || ratingFilter !== "all" || houseFilter !== "all";

  // Pagination for filtered comments
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedComments = filteredComments.slice(startIndex, endIndex);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalComments = comments.length;
    const avgRating = totalComments > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / totalComments
      : 0;
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: comments.filter(c => c.rating === rating).length,
      percentage: totalComments > 0 
        ? (comments.filter(c => c.rating === rating).length / totalComments) * 100 
        : 0
    }));

    const recentComments = comments.filter(c => {
      const commentDate = new Date(c.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return commentDate > thirtyDaysAgo;
    }).length;

    return {
      totalComments,
      avgRating,
      ratingDistribution,
      recentComments
    };
  }, [comments]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
      <BlurFade className="w-full flex flex-col gap-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalCount")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics.recentComments} در ماه گذشته
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">میانگین امتیاز</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {statistics.avgRating.toFixed(1)}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= Math.round(statistics.avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              از {statistics.totalComments} نظر
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نظرات مثبت</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.ratingDistribution
                .filter(r => r.rating >= 4)
                .reduce((sum, r) => sum + r.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics.totalComments > 0 
                ? ((statistics.ratingDistribution
                    .filter(r => r.rating >= 4)
                    .reduce((sum, r) => sum + r.count, 0) / statistics.totalComments) * 100).toFixed(0)
                : 0}% از کل نظرات
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">توزیع امتیازات</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {statistics.ratingDistribution.slice(0, 3).map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-xs w-3">{item.rating}</span>
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="bg-subBg border-none shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl">{t("title")}</CardTitle>
              <span className="text-sm text-subText">
                مدیریت و نظارت بر نظرات مشتریان
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Filters Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter size={16} className="text-primary" />
              <span>فیلترها</span>
              {hasActiveFilters && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  فعال
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subText group-hover:text-primary transition-colors" size={20} />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-lg border-2 bg-background hover:border-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="w-[200px]">
                <CommonSelect
                  label={t("filterByRating")}
                  placeholder={t("allRatings")}
                  selectItems={[
                    { label: t("allRatings"), value: "all" },
                    { label: t("5stars"), value: "5" },
                    { label: t("4stars"), value: "4" },
                    { label: t("3stars"), value: "3" },
                    { label: t("2stars"), value: "2" },
                    { label: t("1star"), value: "1" },
                  ]}
                  value={ratingFilter}
                  onValueChange={setRatingFilter}
                  classname="border-2 hover:border-primary/50 transition-colors"
                />
              </div>

              {/* House Filter */}
              <div className="w-[250px]">
                <CommonSelect
                  label={t("filterByHouse")}
                  placeholder={t("allHouses")}
                  selectItems={[
                    { label: t("allHouses"), value: "all" },
                    ...houses.map((house) => ({
                      label: house.title,
                      value: house.id,
                    })),
                  ]}
                  value={houseFilter}
                  onValueChange={setHouseFilter}
                  classname="border-2 hover:border-primary/50 transition-colors"
                />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 border-2 hover:border-destructive hover:text-destructive transition-colors"
                >
                  <X size={16} />
                  {t("clearFilters")}
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-dashed border-border/50 my-2" />

          {/* Comments List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-subBg2 rounded-xl p-4 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-4 flex-1">
                      <div className="h-10 w-10 bg-muted rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/6" />
                      </div>
                    </div>
                  </div>
                  <div className="h-16 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : paginatedComments.length > 0 ? (
            <div className="space-y-4">
              {paginatedComments.map((comment, index) => {
                const house = houses.find((h) => h.id === comment.houseId.toString());
                return (
                  <BlurFade
                    key={comment.id}
                    delay={0.1 * index}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-subBg2 to-subBg2/50 rounded-xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      {/* Comment Header */}
                      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                        <div className="flex gap-4 items-start flex-1">
                          {/* User Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20">
                            {comment.user.firstName.charAt(0)}{comment.user.lastName.charAt(0)}
                          </div>
                          
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex gap-3 items-center flex-wrap">
                              <span className="font-bold text-lg">
                                {comment.user.firstName} {comment.user.lastName}
                              </span>
                              <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                                {renderStars(comment.rating)}
                                <span className="text-xs font-medium text-yellow-600 mr-1">
                                  {comment.rating}.0
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 flex-wrap text-sm text-subText">
                              <span className="flex items-center gap-1">
                                <span className="text-xs">📅</span>
                                {convertToJalaliString(comment.createdAt)}
                              </span>
                              
                              {house && (
                                <>
                                  <span className="text-muted">•</span>
                                  <Link
                                    href={`/rent/${house.id}`}
                                    className="text-primary hover:underline flex items-center gap-1 font-medium group-hover:text-primary/80 transition-colors"
                                  >
                                    <span className="text-xs">🏠</span>
                                    {house.title}
                                    <Eye size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <CommonModal
                          handleClick={t("delete")}
                          title={t("deleteConfirm")}
                          onClick={() => handleDeleteComment(comment.id)}
                          button={
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 size={16} />
                            </Button>
                          }
                        />
                      </div>

                      {/* Comment Content */}
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/30">
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </BlurFade>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                  <MessageSquare size={40} className="text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">{t("noComments")}</p>
                  <p className="text-sm text-muted-foreground">
                    {hasActiveFilters 
                      ? "هیچ نظری با این فیلترها یافت نشد" 
                      : "هنوز نظری برای املاک شما ثبت نشده است"}
                  </p>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-2"
                  >
                    حذف فیلترها
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex w-full justify-between items-center pt-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                نمایش {startIndex + 1} تا {Math.min(endIndex, totalCount)} از {totalCount} نظر
              </div>
              <Pagination className="w-fit">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (page <= 3) {
                      pageNum = idx + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = page - 2 + idx;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={page === pageNum}
                          onClick={() => setPage(pageNum)}
                          className={
                            page === pageNum
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "hover:bg-primary/10 cursor-pointer"
                          }
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </BlurFade>
  );
};

export default ManageCommentsComponent;

