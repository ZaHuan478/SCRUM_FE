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
        <div className="flex flex-col gap-md rounded-2xl border border-white/60 bg-surface/60 px-md py-md shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t('common.showingRange', { first: firstItem, last: lastItem, total: totalItems, itemLabel })}
            </p>

            <div className="flex flex-wrap items-center gap-xs">
                <button
                    className="inline-flex min-h-10 items-center gap-xs rounded-xl border border-outline-variant/45 bg-surface/76 px-sm py-xs font-label-md text-label-md text-on-surface shadow-sm transition-colors hover:border-primary/45 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
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
                                    ? 'h-10 min-w-10 rounded-xl border border-primary bg-primary px-sm font-label-md text-label-md text-on-primary shadow-[0_10px_20px_rgba(2,132,199,0.18)]'
                                    : 'h-10 min-w-10 rounded-xl border border-outline-variant/45 bg-surface/76 px-sm font-label-md text-label-md text-on-surface shadow-sm transition-colors hover:border-primary/45 hover:text-primary'
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
                    className="inline-flex min-h-10 items-center gap-xs rounded-xl border border-outline-variant/45 bg-surface/76 px-sm py-xs font-label-md text-label-md text-on-surface shadow-sm transition-colors hover:border-primary/45 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
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
