import TopNavBar from '../Organisms/TopNavBar'
import HeroSection from '../Organisms/HeroSection'
import FeaturedDoctorsSection from '../Organisms/FeaturedDoctorsSection'
import DepartmentsSection from '../Organisms/DepartmentsSection'
import HowItWorksSection from '../Organisms/HowItWorksSection'
import TestimonialsSection from '../Organisms/TestimonialsSection'

type HomeTemplateProps = {
  searchQuery: string
  onSearch: (query: string) => void
}

const HomeTemplate = ({ searchQuery, onSearch }: HomeTemplateProps) => {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="doctors" />
      <main>
        <HeroSection onSearch={onSearch} />
        <FeaturedDoctorsSection query={searchQuery} />
        <DepartmentsSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
    </div>
  )
}

export default HomeTemplate
