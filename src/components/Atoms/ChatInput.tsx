import type { FormEvent } from 'react'
import { useTranslation } from '../../contexts/LanguageContext'
import Icon from './Icon'

type ChatInputProps = {
  disabled?: boolean
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

const ChatInput = ({ disabled = false, value, onChange, onSubmit }: ChatInputProps) => {
  const { t } = useTranslation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="flex items-end gap-sm border-t border-outline-variant/30 bg-surface p-sm" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="ai-chat-input">{t('symptomChecker.searchAria')}</label>
      <textarea
        className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-sm font-body-sm text-body-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-4 focus:ring-primary/10"
        disabled={disabled}
        id="ai-chat-input"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            onSubmit()
          }
        }}
        placeholder={t('symptomChecker.searchPlaceholder')}
        value={value}
      />
      <button
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled || !value.trim()}
        type="submit"
      >
        <Icon name="send" />
      </button>
    </form>
  )
}

export default ChatInput
