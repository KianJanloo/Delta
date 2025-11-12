'use client';

import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  cell: (item: T, index: number) => ReactNode;
}

interface AdminResourceTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  errorMessage?: string | null;
  getKey?: (item: T, index: number) => string | number;
}

const AdminResourceTable = <T,>({
  columns,
  data,
  isLoading = false,
  loadingRows = 6,
  emptyMessage = "داده‌ای برای نمایش وجود ندارد.",
  errorMessage,
  getKey,
}: AdminResourceTableProps<T>) => {
  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-6 text-sm text-rose-600 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300">
        {errorMessage}
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[560px] w-full" dir="rtl">
      <Table className="text-right">
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={cn("text-right", column.className)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: loadingRows }).map((_, skeletonIndex) => (
                <TableRow key={`loading-${skeletonIndex}`}>
                  {columns.map((column) => (
                    <TableCell key={`${column.key}-${skeletonIndex}`} className={cn("text-right", column.className)}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.length > 0
              ? data.map((item, index) => (
                  <TableRow key={getKey ? getKey(item, index) : index}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn("text-right", column.className)}>
                        {column.cell(item, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      {emptyMessage}
                    </div>
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AdminResourceTable;

