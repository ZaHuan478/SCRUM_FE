import { useState } from 'react'
import type { FormEvent } from 'react'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import { useTranslation } from '../../../contexts/LanguageContext'

type SearchPanelProps = {
  onSearch?: (query: string) => void
}

const SearchPanel = ({ onSearch }: SearchPanelProps) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <form
      className="flex max-w-2xl flex-col gap-sm rounded-[4px] border border-[#c2c2c2] bg-white p-sm md:flex-row"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-grow items-center gap-sm border-b border-[#e8e8e8] px-md py-sm md:border-b-0 md:border-r">
        <Icon name="search" className="text-[#636363]" />
        <Input
          aria-label={t('home.hero.searchAria')}
          className="border-none bg-transparent p-0 text-[#1a1a1a] placeholder:text-[#636363] focus:border-transparent focus:ring-0"
          onChange={(event) => setQuery(event.target.value)}
          placeholder=""
          type="text"
          value={query}
          wrapperClassName="w-full"
        />
      </div>
      <button
        className="inline-flex min-h-11 w-full items-center justify-center gap-sm rounded-[4px] bg-[#024ad8] px-xl py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-white transition-colors hover:bg-[#0e3191] md:w-auto"
        type="submit"
      >
        <span>{t('home.hero.searchButton')}</span>
        <Icon name="arrow_forward" />
      </button>
    </form>
  )
}

export default SearchPanel
