import { useMemo } from 'react'
import MedicalRecordsPanel from '../components/Organisms/MedicalRecordsPanel'
import NotificationsPanel from '../components/Organisms/NotificationsPanel'
import PatientDashboardFooter from '../components/Organisms/PatientDashboardFooter'
import PatientDashboardHeader from '../components/Organisms/PatientDashboardHeader'
import PatientDashboardSidebar from '../components/Organisms/PatientDashboardSidebar'
import QuickActionsPanel from '../components/Organisms/QuickActionsPanel'
import UpcomingAppointmentCard from '../components/Organisms/UpcomingAppointmentCard'
import {
  dashboardNotifications,
  fallbackPatient,
  quickActions,
  recentMedicalRecords,
  upcomingAppointment,
} from '../data/patientDashboard'
import { getStoredUser } from '../services/auth.service'
import type { PatientSummary } from '../data/patientDashboard'

const getDisplayName = (fullName?: string | null) => {
  const name = fullName?.trim()

  if (!name) return fallbackPatient.displayName

  return name.split(/\s+/)[0]
}

const PatientDashboardPage = () => {
  const patient = useMemo<PatientSummary>(() => {
    const user = getStoredUser()

    if (!user) return fallbackPatient

    const fullName = user.full_name?.trim() || user.email

    return {
      ...fallbackPatient,
      displayName: getDisplayName(user.full_name || user.email),
      fullName,
      patientCode: `MP-${user.id}`,
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-on-background">
      <PatientDashboardSidebar />
      <main className="mx-auto max-w-7xl px-lg py-xl md:px-xxl lg:ml-64 lg:py-xxl">
        <PatientDashboardHeader patient={patient} />
        <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
          <div className="flex flex-col gap-lg lg:col-span-8">
            <UpcomingAppointmentCard appointment={upcomingAppointment} />
            <MedicalRecordsPanel records={recentMedicalRecords} />
          </div>
          <div className="flex flex-col gap-lg lg:col-span-4">
            <QuickActionsPanel actions={quickActions} />
            <NotificationsPanel notifications={dashboardNotifications} />
          </div>
        </div>
        <PatientDashboardFooter />
      </main>
    </div>
  )
}

export default PatientDashboardPage
