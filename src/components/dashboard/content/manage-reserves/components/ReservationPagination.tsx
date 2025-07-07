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
  onPageChange: (page: number) => void;
}

export default function ReservationPagination({
  currentPage,
  onPageChange,
}: ReservationPaginationProps) {
  return (
    <div className="flex w-full justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              className={currentPage === 1 ? "bg-primary text-primary-foreground" : ""}
              onClick={() => onPageChange(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              className={currentPage === 2 ? "bg-primary text-primary-foreground" : ""}
              onClick={() => onPageChange(2)}
            >
              2
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={currentPage === 2 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
} 