import { Link } from 'react-router-dom'
import { useTranslation } from '../../../contexts/LanguageContext'
import Icon from '../../Atoms/Icon'
import Button from '../../Atoms/Button'
import SuggestedDoctorCard from '../../Molecules/SymptomChecker/SuggestedDoctorCard'
import type { SuggestedDoctor } from '../../Molecules/SymptomChecker/SuggestedDoctorCard'

type SuggestedDoctorsPanelProps = {
  doctors: SuggestedDoctor[]
  status: 'loading' | 'ready' | 'error'
}

const SuggestedDoctorsPanel = ({ doctors, status }: SuggestedDoctorsPanelProps) => {
  const { t } = useTranslation()

  return (
    <section className="space-y-xl lg:col-span-8">
      <div className="flex items-center justify-between gap-md rounded-2xl border border-white/70 bg-surface/72 p-md shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-md">
          <Icon name="groups" className="text-primary" />
          <h2 className="font-headline-sm text-headline-sm text-on-background">{t('symptomChecker.suggestedDoctors')}</h2>
        </div>
        <Link to="/doctors">
          <Button className="flex items-center gap-xs border-primary px-md text-primary transition-all hover:gap-sm" fullWidth={false} type="button" variant="ghost">
            {t('common.viewAll')} <Icon name="arrow_forward" />
          </Button>
        </Link>
      </div>
      {status === 'loading' && (
        <p className="rounded-2xl border border-outline-variant/45 bg-surface/78 p-md font-body-sm text-body-sm text-on-surface-variant shadow-sm backdrop-blur-xl">
          {t('symptomChecker.loadingDoctors')}
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          {t('symptomChecker.doctorsBackendError')}
        </p>
      )}
      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          {doctors.map((doctor, index) => (
            <SuggestedDoctorCard doctor={doctor} key={`${doctor.name || 'doctor'}-${index}`} />
          ))}
        </div>
      ) : (
        status !== 'loading' && (
          <p className="rounded-2xl border border-outline-variant/45 bg-surface/78 p-lg text-center font-body-md text-body-md text-on-surface-variant shadow-sm backdrop-blur-xl">
            {t('symptomChecker.noDoctorData')}
          </p>
        )
      )}
    </section>
  )
}

export default SuggestedDoctorsPanel
