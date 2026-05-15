import { useState } from 'react'
import TopNavBar from '../components/Organisms/TopNavBar'
import HeroSection from '../components/Organisms/HeroSection'
import TrustedHospitals from '../components/Organisms/TrustedHospitals'
import FeaturedDoctorsSection from '../components/Organisms/FeaturedDoctorsSection'
import DepartmentsSection from '../components/Organisms/DepartmentsSection'
import HowItWorksSection from '../components/Organisms/HowItWorksSection'
import TestimonialsSection from '../components/Organisms/TestimonialsSection'
// import AppFooter from '../components/Organisms/AppFooter'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    document.getElementById('featured-doctors')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar />
      <main>
        <HeroSection onSearch={handleSearch} />
        <TrustedHospitals />
        <FeaturedDoctorsSection query={searchQuery} />
        <DepartmentsSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
    </div>
  )
}

export default HomePage
