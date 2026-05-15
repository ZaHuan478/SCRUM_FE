import Badge from '../Atoms/Badge'
import Icon from '../Atoms/Icon'
import SearchPanel from '../Molecules/SearchPanel'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAywBK4YuLlmNNX2MhTdRjCj6tdRcc1fWbW-HeJoAxCVZ0KCFlMixlHo6qM6TBeXcJHcDH0zpCPvQmXEr4zPeXEHYgZoaVn9ASOEeBlF0iWyOCkE8-0pC9htNA7RCoVfVw_BaqBRBG1a5Sf-ADOSdCiuyebUSl_t66s7xmIxzd0LyWRhaIv_wGrA0A_TWy76tHY_rmziYAvMj0i30o6NXQKHyZ4uLU4D5iUi3fwSpU6rxcN8d9QGi0-JZzp6tqsSk9CetRm1BLb03vz'

type HeroSectionProps = {
  onSearch: (query: string) => void
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-lg pb-xxxl pt-xxxl md:px-xxl">
      <div className="grid grid-cols-1 items-center gap-xxl md:grid-cols-12">
        <div className="z-10 md:col-span-7">
          <Badge className="mb-md">Y khoa chính xác và tin cậy</Badge>
          <h1 className="mb-lg max-w-3xl font-display-lg text-4xl font-bold leading-tight text-on-background md:text-display-lg">
            Tìm đúng bác sĩ, <span className="text-primary">đúng lúc.</span>
          </h1>
          <p className="mb-xxl max-w-xl font-body-lg text-body-lg text-on-surface-variant">
            Kết nối với chuyên gia phù hợp dựa trên triệu chứng, chuyên khoa và nhu cầu thăm khám cụ thể của bạn.
          </p>
          <SearchPanel onSearch={onSearch} />
        </div>
        <div className="relative md:col-span-5">
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            <img
              alt="Bác sĩ chuyên nghiệp tại MedPrecision"
              className="aspect-[4/5] h-auto w-full object-cover"
              src={HERO_IMAGE}
            />
            <div className="absolute bottom-md left-md right-md rounded-xl border border-outline-variant/20 bg-surface/90 p-md shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
                  <Icon name="verified" className="text-on-secondary-container" />
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Chuyên gia đã xác thực</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Hồ sơ bác sĩ được đồng bộ từ hệ thống backend.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
