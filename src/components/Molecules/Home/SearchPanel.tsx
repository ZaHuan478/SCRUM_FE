import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'

type SearchPanelProps = {
  onSearch?: (query: string) => void
}

const SearchPanel = ({ onSearch }: SearchPanelProps) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <form
      className="flex max-w-2xl flex-col gap-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-sm shadow-xl md:flex-row"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-grow items-center gap-sm border-b border-outline-variant/30 px-md py-sm md:border-b-0 md:border-r">
        <Icon name="search" className="text-outline" />
        <Input
          aria-label="Tìm kiếm"
          className="border-none bg-transparent p-0 focus:border-transparent focus:ring-0"
          onChange={(event) => setQuery(event.target.value)}
          placeholder=""
          type="text"
          value={query}
          wrapperClassName="w-full"
        />
      </div>
      <Button className="inline-flex items-center justify-center gap-sm px-lg py-md" fullWidth={false} type="submit">
        <span>Tìm bác sĩ phù hợp</span>
        <Icon name="arrow_forward" />
      </Button>
    </form>
  )
}

export default SearchPanel
