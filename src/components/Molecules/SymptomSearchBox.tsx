import type { FormEvent } from 'react'
import Button from '../Atoms/Button'
import Icon from '../Atoms/Icon'
import Input from '../Atoms/Input'

type SymptomSearchBoxProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

const SymptomSearchBox = ({ value, onChange, onSubmit }: SymptomSearchBoxProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-sm shadow-sm sm:flex-row" onSubmit={handleSubmit}>
      <div className="flex flex-grow items-center gap-sm px-md">
        <Icon name="search" className="text-xl text-primary" />
        <Input
          aria-label="Triệu chứng"
          className="border-none bg-transparent p-0 focus:border-transparent focus:ring-0"
          onChange={(event) => onChange(event.target.value)}
          placeholder=""
          type="text"
          value={value}
          wrapperClassName="w-full"
        />
      </div>
      <Button className="px-xl py-sm" fullWidth={false} type="submit">
        Phân tích
      </Button>
    </form>
  )
}

export default SymptomSearchBox
