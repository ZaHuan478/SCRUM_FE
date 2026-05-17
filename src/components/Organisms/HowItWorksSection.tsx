import StepItem from '../Molecules/StepItem'

type StepData = {
  title: string
  description: string
}

const steps: StepData[] = []

const HowItWorksSection = () => {
  if (steps.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-lg py-xxxl md:px-xxl" id="how-it-works">
      <div className="mb-xxl text-center">
        <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Cách thức hoạt động</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Hành trình hướng tới sức khỏe tốt hơn chỉ qua các bước đơn giản.</p>
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
