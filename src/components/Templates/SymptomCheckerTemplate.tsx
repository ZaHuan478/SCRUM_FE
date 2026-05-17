import TopNavBar from '../Organisms/TopNavBar'
import SymptomHeroSection from '../Organisms/SymptomChecker/SymptomHeroSection'
import SuggestedDepartmentsPanel from '../Organisms/SymptomChecker/SuggestedDepartmentsPanel'
import SuggestedDoctorsPanel from '../Organisms/SymptomChecker/SuggestedDoctorsPanel'
import EmergencyCtaSection from '../Organisms/SymptomChecker/EmergencyCtaSection'
import type { SuggestedDepartment } from '../Molecules/SuggestedDepartmentCard'
import type { SuggestedDoctor } from '../Molecules/SuggestedDoctorCard'

type SymptomCheckerTemplateProps = {
  query: string
  departments: SuggestedDepartment[]
  doctors: SuggestedDoctor[]
  doctorStatus: 'loading' | 'ready' | 'error'
  onQueryChange: (query: string) => void
  onSearch: () => void
  onSuggestionSelect: (suggestion: string) => void
}

const SymptomCheckerTemplate = ({
  query,
  departments,
  doctors,
  doctorStatus,
  onQueryChange,
  onSearch,
  onSuggestionSelect,
}: SymptomCheckerTemplateProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <TopNavBar active="symptoms" />
      <main className="flex-grow">
        <SymptomHeroSection
          onQueryChange={onQueryChange}
          onSearch={onSearch}
          onSuggestionSelect={onSuggestionSelect}
          query={query}
        />
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-xxl px-lg py-xxl md:px-xxl lg:grid-cols-12" id="symptom-results">
          <SuggestedDepartmentsPanel departments={departments} />
          <SuggestedDoctorsPanel doctors={doctors} status={doctorStatus} />
        </section>
        <EmergencyCtaSection />
      </main>
    </div>
  )
}

export default SymptomCheckerTemplate
