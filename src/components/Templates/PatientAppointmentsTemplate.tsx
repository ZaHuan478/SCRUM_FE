import TopNavBar from '../Organisms/TopNavBar'
import PatientAppointmentBookingPanel from '../Organisms/PatientAppointments/PatientAppointmentBookingPanel'
import PatientAppointmentHistoryPanel from '../Organisms/PatientAppointments/PatientAppointmentHistoryPanel'
import PatientAppointmentStatsGrid from '../Organisms/PatientAppointments/PatientAppointmentStatsGrid'
import type { PatientAppointmentsState } from '../../hooks/usePatientAppointments'
import type { User } from '../../services/auth.service'

type PatientAppointmentsTemplateProps = PatientAppointmentsState & {
  user: User
}

const PatientAppointmentsTemplate = ({
  appointmentActionId,
  appointmentStatus,
  appointments,
  bookingError,
  bookingSuccess,
  cancelMyAppointment,
  departmentStatus,
  departments,
  loadAppointments,
  matchedSymptoms,
  reason,
  recommendedDepartments,
  recommendationStatus,
  selectedDate,
  selectedDepartmentId,
  selectedSlot,
  selectedSlotId,
  selectDate,
  selectDepartment,
  selectSlot,
  setReason,
  slotStatus,
  slots,
  stats,
  submitAppointment,
  upcomingDays,
}: PatientAppointmentsTemplateProps) => (
  <div className="min-h-screen bg-background text-on-background">
    <TopNavBar active="doctors" />
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-xl px-lg py-xl md:px-xxl md:py-xxl">
      <section className="flex flex-col gap-sm border-b border-outline-variant/30 pb-lg">
        <p className="font-label-md text-label-md text-primary">Dành cho bệnh nhân</p>
        <h1 className="font-headline-lg text-headline-lg text-on-background">Đặt lịch hẹn</h1>
        <p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
          Chọn khung giờ còn trống với bác sĩ phù hợp, sau đó theo dõi trạng thái lịch hẹn đã đặt ngay tại đây.
        </p>
      </section>

      <PatientAppointmentStatsGrid stats={stats} />

      <div className="grid grid-cols-1 items-start gap-xl lg:grid-cols-12">
        <PatientAppointmentBookingPanel
          bookingError={bookingError}
          bookingSuccess={bookingSuccess}
          departmentStatus={departmentStatus}
          departments={departments}
          onDateChange={selectDate}
          onDepartmentChange={selectDepartment}
          onReasonChange={setReason}
          onSelectSlot={selectSlot}
          onSubmit={() => {
            void submitAppointment()
          }}
          matchedSymptoms={matchedSymptoms}
          reason={reason}
          recommendedDepartments={recommendedDepartments}
          recommendationStatus={recommendationStatus}
          selectedDate={selectedDate}
          selectedDepartmentId={selectedDepartmentId}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          slotStatus={slotStatus}
          slots={slots}
          upcomingDays={upcomingDays}
        />

        <PatientAppointmentHistoryPanel
          actionId={appointmentActionId}
          appointments={appointments}
          onCancel={(appointment) => {
            void cancelMyAppointment(appointment)
          }}
          onRefresh={() => {
            void loadAppointments()
          }}
          status={appointmentStatus}
        />
      </div>
    </main>
  </div>
)

export default PatientAppointmentsTemplate
