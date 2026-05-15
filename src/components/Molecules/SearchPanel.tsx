import { useState } from 'react'
import type { FormEvent } from 'react'
import Icon from '../Atoms/Icon'

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
      <label className="flex flex-grow items-center gap-sm border-b border-outline-variant/30 px-md py-sm md:border-b-0 md:border-r">
        <Icon name="search" className="text-outline" />
        <span className="sr-only">Tìm kiếm</span>
        <input
          className="w-full border-none bg-transparent p-0 font-body-md text-body-md text-on-surface outline-none placeholder:text-outline focus:ring-0"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm triệu chứng, bác sĩ, hoặc phòng khám..."
          type="text"
          value={query}
        />
      </label>
      <button className="inline-flex items-center justify-center gap-sm rounded-lg bg-primary px-lg py-md font-label-md text-label-md text-on-primary shadow-md transition-colors hover:bg-primary-container" type="submit">
        <span>Tìm bác sĩ phù hợp</span>
        <Icon name="arrow_forward" />
      </button>
    </form>
  )
}

export default SearchPanel
