import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReservationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ReservationPagination({
  currentPage,
  onPageChange,
  totalPages,
}: ReservationPaginationProps) {
  return (
    <div className="flex w-full justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, idx) => {
            return (
              <PaginationItem key={idx}>
                <PaginationLink
                  className={
                    currentPage === idx + 1
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  onClick={() => onPageChange(idx + 1)}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
