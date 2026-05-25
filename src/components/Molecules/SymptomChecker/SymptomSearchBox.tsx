import type { FormEvent } from 'react'
import { useTranslation } from '../../../contexts/LanguageContext'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'

type SymptomSearchBoxProps = {
  suggestions?: string[]
  value: string
  onChange: (value: string) => void
  onSuggestionSelect?: (suggestion: string) => void
  onSubmit: () => void
}

const SymptomSearchBox = ({
  suggestions = [],
  value,
  onChange,
  onSuggestionSelect,
  onSubmit,
}: SymptomSearchBoxProps) => {
  const { t } = useTranslation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <div className="space-y-sm">
      <form className="flex flex-col gap-sm rounded border border-outline-variant bg-surface p-sm shadow-[0_2px_8px_rgba(26,26,26,0.08)] sm:flex-row" onSubmit={handleSubmit}>
        <div className="flex flex-grow items-center gap-sm px-md">
          <Icon className="text-xl text-outline" name="search" />
          <Input
            aria-label={t('symptomChecker.searchAria')}
            className="border-none bg-transparent p-0 focus:border-transparent focus:ring-0"
            onChange={(event) => onChange(event.target.value)}
            placeholder={t('symptomChecker.searchPlaceholder')}
            type="text"
            value={value}
            wrapperClassName="w-full"
          />
        </div>
        <Button className="px-xl py-sm" fullWidth={false} type="submit">
          {t('symptomChecker.analyze')}
        </Button>
      </form>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-xs">
          {suggestions.map((suggestion) => (
            <button
              className="rounded-lg border border-outline-variant bg-surface px-sm py-xs font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              key={suggestion}
              onClick={() => onSuggestionSelect?.(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SymptomSearchBox
