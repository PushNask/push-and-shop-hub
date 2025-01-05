import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

interface PaginationProps extends React.ComponentProps<"nav"> {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ className, count, page, onPageChange, ...props }: PaginationProps) => {
  const pages = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <PaginationPrevious 
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
          />
        </li>
        
        {pages.map((pageNum) => (
          <li key={pageNum}>
            <PaginationLink
              isActive={pageNum === page}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </PaginationLink>
          </li>
        ))}
        
        <li>
          <PaginationNext 
            onClick={() => page < count && onPageChange(page + 1)}
            disabled={page >= count}
          />
        </li>
      </ul>
    </nav>
  )
}

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"button">) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

export { Pagination }