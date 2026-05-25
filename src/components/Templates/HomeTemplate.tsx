import TopNavBar from '../Organisms/TopNavBar'
import HeroSection from '../Organisms/Home/HeroSection'
import FeaturedDoctorsSection from '../Organisms/Home/FeaturedDoctorsSection'
import DepartmentsSection from '../Organisms/DepartmentDesign/DepartmentsSection'
import HowItWorksSection from '../Organisms/Home/HowItWorksSection'
import TestimonialsSection from '../Organisms/Home/TestimonialsSection'

type HomeTemplateProps = {
  searchQuery: string
  onSearch: (query: string) => void
}

const HomeTemplate = ({ searchQuery, onSearch }: HomeTemplateProps) => {
  return (
    <div className="hp-home min-h-screen bg-background text-on-background">
      <TopNavBar active="homepage" variant="hp" />
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
