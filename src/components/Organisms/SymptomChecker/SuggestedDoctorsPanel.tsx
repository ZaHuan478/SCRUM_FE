import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import Button from '../../Atoms/Button'
import SuggestedDoctorCard from '../../Molecules/SymptomChecker/SuggestedDoctorCard'
import type { SuggestedDoctor } from '../../Molecules/SymptomChecker/SuggestedDoctorCard'

type SuggestedDoctorsPanelProps = {
  doctors: SuggestedDoctor[]
  status: 'loading' | 'ready' | 'error'
}

const SuggestedDoctorsPanel = ({ doctors, status }: SuggestedDoctorsPanelProps) => {
  return (
    <section className="space-y-xl lg:col-span-8">
      <div className="flex items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <Icon name="groups" className="text-primary" />
          <h2 className="font-headline-sm text-headline-sm text-on-background">Bác sĩ đề xuất</h2>
        </div>
        <Link to="/doctors">
          <Button className="flex items-center gap-xs border-primary px-md text-primary transition-all hover:gap-sm" fullWidth={false} type="button" variant="ghost">
            Xem tất cả <Icon name="arrow_forward" />
          </Button>
        </Link>
      </div>
      {status === 'loading' && (
        <p className="rounded-lg border border-outline-variant bg-surface p-md font-body-sm text-body-sm text-on-surface-variant">
          Đang tải dữ liệu bác sĩ từ backend...
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa kết nối được backend nên chưa có dữ liệu bác sĩ để hiển thị.
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
          <p className="rounded-lg border border-outline-variant bg-surface p-lg text-center font-body-md text-body-md text-on-surface-variant">
            Chưa có dữ liệu bác sĩ.
          </p>
        )
      )}
    </section>
  )
}

export default SuggestedDoctorsPanel
