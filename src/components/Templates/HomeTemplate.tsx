import TopNavBar from '../Organisms/TopNavBar'
import HeroSection from '../Organisms/Home/HeroSection'
import FeaturedDoctorsSection from '../Organisms/Home/FeaturedDoctorsSection'
import DepartmentsSection from '../Organisms/DepartmentDesign/DepartmentsSection'
import HowItWorksSection from '../Organisms/Home/HowItWorksSection'
import TestimonialsSection from '../Organisms/Home/TestimonialsSection'
import EmergencyCtaSection from '../Organisms/SymptomChecker/EmergencyCtaSection'

type HomeTemplateProps = {
  searchQuery: string
  onSearch: (query: string) => void
}

const HomeTemplate = ({ searchQuery, onSearch }: HomeTemplateProps) => {
  return (
    <div className="min-h-screen  text-on-background">
      <TopNavBar active="homepage" />
      <main>
        <HeroSection onSearch={onSearch} />
        <FeaturedDoctorsSection query={searchQuery} />
        <DepartmentsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <EmergencyCtaSection className="" />
      </main>
    </div>
  )
}

export default HomeTemplate
