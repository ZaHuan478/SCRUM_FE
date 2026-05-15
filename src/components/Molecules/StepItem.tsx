type StepItemProps = {
  index: number
  title: string
  description: string
}

const StepItem = ({ index, title, description }: StepItemProps) => {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="mb-lg flex h-20 w-20 items-center justify-center rounded-full bg-primary font-headline-lg text-headline-lg text-on-primary shadow-xl">
        {index}
      </div>
      <h3 className="mb-md font-headline-sm text-headline-sm text-on-background">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
    </article>
  )
}

export default StepItem
