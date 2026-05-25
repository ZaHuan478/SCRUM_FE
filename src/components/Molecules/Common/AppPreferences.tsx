import Icon from '../../Atoms/Icon'
import Select from './Select'
import { languages, useTranslation } from '../../../contexts/LanguageContext'
import type { Language } from '../../../contexts/LanguageContext'
import { useTheme } from '../../../contexts/ThemeContext'

const AppPreferences = () => {
  const { language, setLanguage, t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-sm">
      <label className="sr-only" htmlFor="language-select">
        {t('preferences.language')}
      </label>
      <Select
        className="h-10 rounded border border-outline-variant bg-surface px-sm font-label-md text-label-md text-on-surface outline-none transition-colors hover:border-primary focus:border-on-surface"
        id="language-select"
        label=""
        menuClassName="min-w-28"
        onChange={(value) => setLanguage(value as Language)}
        options={languages.map((item) => ({ label: item.shortLabel, value: item.code }))}
        title={t('preferences.language')}
        value={language}
      />
      <button
        aria-label={theme === 'dark' ? t('preferences.light') : t('preferences.dark')}
        className="flex h-10 w-10 items-center justify-center rounded border border-outline-variant bg-surface text-on-surface transition-colors hover:border-primary hover:text-primary focus:outline-none focus:border-on-surface"
        onClick={toggleTheme}
        title={theme === 'dark' ? t('preferences.light') : t('preferences.dark')}
        type="button"
      >
        <Icon className="text-xl" name={theme === 'dark' ? 'light_mode' : 'dark_mode'} />
      </button>
    </div>
  )
}

export default AppPreferences
