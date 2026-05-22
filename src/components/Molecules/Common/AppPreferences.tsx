import Icon from '../../Atoms/Icon'
import { languages, useTranslation } from '../../../contexts/LanguageContext'
import { useTheme } from '../../../contexts/ThemeContext'

const AppPreferences = () => {
  const { language, setLanguage, t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-sm">
      <label className="sr-only" htmlFor="language-select">
        {t('preferences.language')}
      </label>
      <select
        className="h-10 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-sm font-label-md text-label-md text-on-surface shadow-sm outline-none transition-colors hover:bg-surface-container-high focus:ring-2 focus:ring-primary/40"
        id="language-select"
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        title={t('preferences.language')}
        value={language}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.shortLabel}
          </option>
        ))}
      </select>
      <button
        aria-label={theme === 'dark' ? t('preferences.light') : t('preferences.dark')}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40"
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
