import { useState } from 'react'
import AppFooter from '../components/Organisms/AppFooter'
import DoctorBiographySection from '../components/Organisms/DoctorBiographySection'
import DoctorBookingWidget from '../components/Organisms/DoctorBookingWidget'
import DoctorEducationPanel from '../components/Organisms/DoctorEducationPanel'
import DoctorPracticePanel from '../components/Organisms/DoctorPracticePanel'
import DoctorProfileHero from '../components/Organisms/DoctorProfileHero'
import DoctorReviewsPanel from '../components/Organisms/DoctorReviewsPanel'
import TopNavBar from '../components/Organisms/TopNavBar'
import DoctorDetailTabs from '../components/Molecules/DoctorDetailTabs'
import { doctorDetail, doctorDetailTabs } from '../data/doctorDetail'

const DoctorDetailPage = () => {
  const [activeTab, setActiveTab] = useState(doctorDetailTabs[0])

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar />
      <main className="mx-auto max-w-7xl px-lg py-xl md:px-xxl">
        <div className="grid grid-cols-1 gap-xxl lg:grid-cols-12">
          <div className="flex flex-col gap-xl lg:col-span-8">
            <DoctorProfileHero doctor={doctorDetail} />
            <DoctorDetailTabs activeTab={activeTab} onSelect={setActiveTab} tabs={doctorDetailTabs} />
            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
              <DoctorBiographySection paragraphs={doctorDetail.biography} />
              <DoctorEducationPanel education={doctorDetail.education} />
              <DoctorPracticePanel practice={doctorDetail.practice} />
              <DoctorReviewsPanel reviews={doctorDetail.reviews} />
            </div>
          </div>
          <DoctorBookingWidget />
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export default DoctorDetailPage
