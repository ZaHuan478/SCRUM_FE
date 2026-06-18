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
      className="flex flex-col gap-sm rounded-2xl border border-white/65 bg-surface/74 p-sm shadow-[0_20px_55px_rgba(15,23,42,0.10)] backdrop-blur-2xl md:flex-row"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-grow items-center gap-sm border-b border-outline-variant/35 px-md py-sm md:border-b-0 md:border-r">
        <Icon name="search" className="text-outline" />
        <Input
          aria-label={t('home.hero.searchAria')}
          className="border-none bg-transparent p-0 text-on-surface placeholder:text-outline focus:border-transparent focus:ring-0"
          onChange={(event) => setQuery(event.target.value)}
          placeholder=""
          type="text"
          value={query}
          wrapperClassName="w-full"
        />
      </div>
      <button
        className="inline-flex min-h-11 w-full items-center justify-center gap-sm rounded-xl bg-primary px-xl py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary shadow-[0_12px_24px_rgba(2,132,199,0.20)] transition-all hover:-translate-y-0.5 hover:bg-primary-container md:w-auto"
        type="submit"
      >
        <span>{t('home.hero.searchButton')}</span>
        <Icon name="arrow_forward" />
      </button>
    </form>
  )
}

export default SearchPanel
