import StepItem from '../Molecules/StepItem'

const steps = [
  {
    title: 'Tìm kiếm',
    description: 'Nhập triệu chứng, chuyên khoa hoặc tên bác sĩ bạn muốn thăm khám.',
  },
  {
    title: 'Lựa chọn',
    description: 'So sánh hồ sơ bác sĩ, kinh nghiệm, phí tư vấn và các thông tin liên quan.',
  },
  {
    title: 'Đặt lịch',
    description: 'Xác nhận lịch hẹn và nhận thông tin theo dõi trực tiếp trên hệ thống.',
  },
]

const HowItWorksSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-lg py-xxxl md:px-xxl" id="how-it-works">
      <div className="mb-xxl text-center">
        <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Cách thức hoạt động</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Hành trình hướng tới sức khỏe tốt hơn chỉ qua ba bước.</p>
      </div>
      <div className="relative grid grid-cols-1 gap-xxl md:grid-cols-3">
        <div className="absolute left-1/3 right-1/3 top-1/4 -z-10 hidden h-px bg-primary-fixed md:block" />
        {steps.map((step, index) => (
          <StepItem
            description={step.description}
            index={index + 1}
            key={step.title}
            title={step.title}
          />
        ))}
      </div>
    </section>
  )
}

export default HowItWorksSection
