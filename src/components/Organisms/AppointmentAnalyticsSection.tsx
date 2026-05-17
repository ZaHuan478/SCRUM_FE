import Button from '../Atoms/Button'

export type AnalyticsPoint = {
  label: string
  value: number
}

type AppointmentAnalyticsSectionProps = {
  data: AnalyticsPoint[]
  status: 'loading' | 'ready' | 'error'
  title: string
  description: string
}

const AppointmentAnalyticsSection = ({ data, status, title, description }: AppointmentAnalyticsSectionProps) => {
  const maxValue = Math.max(...data.map((point) => point.value), 0)
  const hasData = maxValue > 0

  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-[0px_4px_20px_rgba(15,23,42,0.05)] md:p-xl">
      <div className="mb-xl flex flex-col justify-between gap-md md:flex-row md:items-center">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>
        </div>
        <div className="flex gap-sm">
          <Button className="bg-surface-container px-md py-xs text-on-surface-variant shadow-none hover:bg-surface-container-high" fullWidth={false} type="button">
            7 ngày
          </Button>
          <Button className="px-md py-xs" fullWidth={false} type="button">
            Lịch hẹn
          </Button>
        </div>
      </div>

      {status === 'loading' && <div className="h-80 animate-pulse rounded-lg bg-surface-container-low" />}
      {status === 'error' && (
        <div className="rounded-lg bg-error-container px-md py-lg text-center font-body-sm text-body-sm text-on-error-container">
          Chưa tải được dữ liệu phân tích lịch hẹn.
        </div>
      )}
      {status === 'ready' && !hasData && (
        <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-md py-xxl text-center font-body-sm text-body-sm text-on-surface-variant">
          Chưa có dữ liệu lịch trong 7 ngày gần nhất.
        </div>
      )}
      {status === 'ready' && hasData && (
        <div className="relative h-80 overflow-hidden rounded-lg bg-surface-container-low p-lg">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(115,118,134,0.16)_1px,transparent_1px)] bg-[length:100%_64px]" />
          <div className="relative flex h-full items-end justify-between gap-md">
            {data.map((point) => {
              const height = Math.max((point.value / maxValue) * 100, 8)

              return (
                <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-sm" key={point.label}>
                  <span className="font-label-sm text-label-sm text-on-surface">{point.value}</span>
                  <div
                    aria-label={`${point.label}: ${point.value}`}
                    className="w-full rounded-t-lg bg-primary transition-all hover:bg-secondary"
                    role="img"
                    style={{ height: `${height}%` }}
                  />
                  <span className="w-full truncate text-center font-label-sm text-label-sm text-on-surface-variant">{point.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default AppointmentAnalyticsSection
