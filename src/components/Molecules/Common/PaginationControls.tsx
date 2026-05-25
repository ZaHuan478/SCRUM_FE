import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'

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
    const { t } = useTranslation()

    if (totalItems === 0) return null

    const safeTotalPages = Math.max(totalPages, 1)
    const safePage = Math.min(Math.max(page, 1), safeTotalPages)
    const firstItem = (safePage - 1) * limit + 1
    const lastItem = Math.min(safePage * limit, totalItems)
    const hasPreviousPage = safePage > 1
    const hasNextPage = safePage < safeTotalPages
    const pageNumbers = getPageNumbers(safePage, safeTotalPages)

    return (
        <div className="flex flex-col gap-md bg-transparent py-md md:flex-row md:items-center md:justify-between">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t('common.showingRange', { first: firstItem, last: lastItem, total: totalItems, itemLabel })}
            </p>

            <div className="flex flex-wrap items-center gap-xs">
                <button
                    className="inline-flex min-h-10 items-center gap-xs rounded border border-outline-variant bg-surface px-sm py-xs font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!hasPreviousPage || isLoading}
                    onClick={() => onPageChange(safePage - 1)}
                    type="button"
                >
                    <Icon className="text-lg" name="chevron_left" />
                    {t('common.previous')}
                </button>

                {pageNumbers.map((pageNumber) => {
                    const isActive = pageNumber === safePage

                    return (
                        <button
                            aria-current={isActive ? 'page' : undefined}
                            className={
                                isActive
                                    ? 'h-10 min-w-10 rounded border border-primary bg-primary px-sm font-label-md text-label-md text-on-primary'
                                    : 'h-10 min-w-10 rounded border border-outline-variant bg-surface px-sm font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary'
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
                    className="inline-flex min-h-10 items-center gap-xs rounded border border-outline-variant bg-surface px-sm py-xs font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!hasNextPage || isLoading}
                    onClick={() => onPageChange(safePage + 1)}
                    type="button"
                >
                    {t('common.next')}
                    <Icon className="text-lg" name="chevron_right" />
                </button>
            </div>
        </div>
    )
}

export default PaginationControls
