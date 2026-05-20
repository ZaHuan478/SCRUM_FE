import Icon from '../../Atoms/Icon'

type PaginationControlsProps = {
    page: number
    totalPages: number
    totalItems: number
    limit: number
    itemLabel: string
    isLoading?: boolean
    onPageChange: (page: number) => void
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
    const safeTotalPages = Math.max(totalPages, 1)
    const startPage = Math.max(1, Math.min(currentPage - 2, safeTotalPages - 4))
    const endPage = Math.min(safeTotalPages, startPage + 4)

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
}

const PaginationControls = ({
    page,
    totalPages,
    totalItems,
    limit,
    itemLabel,
    isLoading = false,
    onPageChange,
}: PaginationControlsProps) => {
    if (totalItems === 0) return null

    const safeTotalPages = Math.max(totalPages, 1)
    const safePage = Math.min(Math.max(page, 1), safeTotalPages)
    const firstItem = (safePage - 1) * limit + 1
    const lastItem = Math.min(safePage * limit, totalItems)
    const hasPreviousPage = safePage > 1
    const hasNextPage = safePage < safeTotalPages
    const pageNumbers = getPageNumbers(safePage, safeTotalPages)

    return (
        <div className="flex flex-col gap-md bg-transparent p-md md:flex-row md:items-center md:justify-between">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
                Hiển thị {firstItem}-{lastItem} trong {totalItems} {itemLabel}
            </p>

            <div className="flex flex-wrap items-center gap-xs">
                <button
                    className="inline-flex items-center gap-xs rounded-lg border border-outline-variant/50 bg-transparent px-sm py-xs font-label-md text-label-md text-on-surface transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!hasPreviousPage || isLoading}
                    onClick={() => onPageChange(safePage - 1)}
                    type="button"
                >
                    <Icon className="text-lg" name="chevron_left" />
                    Trước
                </button>

                {pageNumbers.map((pageNumber) => {
                    const isActive = pageNumber === safePage

                    return (
                        <button
                            aria-current={isActive ? 'page' : undefined}
                            className={
                                isActive
                                    ? 'h-9 min-w-9 rounded-lg border border-primary bg-transparent px-sm font-label-md text-label-md text-primary'
                                    : 'h-9 min-w-9 rounded-lg border border-outline-variant/50 bg-transparent px-sm font-label-md text-label-md text-on-surface transition-all hover:border-primary hover:text-primary'
                            }
                            disabled={isLoading}
                            key={pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                            type="button"
                        >
                            {pageNumber}
                        </button>
                    )
                })}

                <button
                    className="inline-flex items-center gap-xs rounded-lg border border-outline-variant/50 bg-transparent px-sm py-xs font-label-md text-label-md text-on-surface transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!hasNextPage || isLoading}
                    onClick={() => onPageChange(safePage + 1)}
                    type="button"
                >
                    Sau
                    <Icon className="text-lg" name="chevron_right" />
                </button>
            </div>
        </div>
    )
}

export default PaginationControls