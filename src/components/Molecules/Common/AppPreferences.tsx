import Icon from '../../Atoms/Icon'
import Select from './Select'
import { languages, useTranslation } from '../../../contexts/LanguageContext'
import { useTheme } from '../../../contexts/ThemeContext'

const AppPreferences = () => {
  const { language, setLanguage, t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-sm">
      <Select
        className="h-10 px-sm py-0 font-label-md text-label-md focus:ring-2 focus:ring-primary/40"
        id="language-select"
        label=""
        menuClassName="min-w-28"
        onChange={(value) => setLanguage(value as typeof language)}
        options={languages.map((item) => ({ label: item.shortLabel, value: item.code }))}
        title={t('preferences.language')}
        value={language}
      />
      <button
        aria-label={theme === 'dark' ? t('preferences.light') : t('preferences.dark')}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40"
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
