import TopNavBar from '../Organisms/TopNavBar'
import PatientAppointmentBookingPanel from '../Organisms/PatientAppointments/PatientAppointmentBookingPanel'
import PatientAppointmentHistoryPanel from '../Organisms/PatientAppointments/PatientAppointmentHistoryPanel'
import PatientAppointmentStatsGrid from '../Organisms/PatientAppointments/PatientAppointmentStatsGrid'
import PaymentModal from '../Organisms/Payment/PaymentModal'
import type { PatientAppointmentsState } from '../../hooks/usePatientAppointments'
import type { User } from '../../services/auth.service'

type PatientAppointmentsTemplateProps = PatientAppointmentsState & {
  user: User | null
}

const PatientAppointmentsTemplate = ({
  appointmentActionId,
  appointmentPagination,
  appointmentStatus,
  appointments,
  bookingError,
  bookingSuccess,
  cancelMyAppointment,
  clearSelectedDoctor,
  closePaymentModal,
  departmentStatus,
  departments,
  loadAppointments,
  matchedSymptoms,
  openPaymentModal,
  paymentModalPayment,
  reason,
  recommendedDepartments,
  recommendationStatus,
  selectedDate,
  selectedDepartmentId,
  selectedDoctorId,
  selectedDoctorName,
  selectedPaymentPolicy,
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
  user,
}: PatientAppointmentsTemplateProps) => (
  <div className="hp-home hp-soft-home min-h-screen text-on-background">
    <TopNavBar active="doctors" variant="softHome" />
    <main className="mx-auto flex w-full max-w-[1366px] flex-col gap-xl px-lg pb-[72px] pt-[132px] md:px-xxl md:pb-[96px] md:pt-[152px]">
      <section className="rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl md:p-xl">
        <p className="inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.32em] text-on-surface-variant">
          <span className="h-1 w-10 rounded-full bg-primary" />
          Dành cho bệnh nhân
        </p>
        <h1 className="mt-md font-headline-lg text-[42px] font-semibold uppercase leading-[0.92] text-on-background sm:text-[56px] md:text-[72px]">
          Đặt lịch hẹn
        </h1>
        <p className="mt-md max-w-3xl font-body-md text-body-md leading-7 text-on-surface-variant">
          Chọn khung giờ còn trống với bác sĩ phù hợp, sau đó theo dõi trạng thái lịch hẹn đã đặt ngay tại đây.
        </p>
      </section>

      {user?.role === 'PATIENT' && <PatientAppointmentStatsGrid stats={stats} />}

      <div className="grid grid-cols-1 items-start gap-xl lg:grid-cols-12">
        <PatientAppointmentBookingPanel
          bookingError={bookingError}
          bookingSuccess={bookingSuccess}
          departmentStatus={departmentStatus}
          departments={departments}
          matchedSymptoms={matchedSymptoms}
          onClearDoctor={clearSelectedDoctor}
          onDateChange={selectDate}
          onDepartmentChange={selectDepartment}
          onReasonChange={setReason}
          onSelectSlot={selectSlot}
          onSubmit={() => {
            void submitAppointment()
          }}
          reason={reason}
          recommendedDepartments={recommendedDepartments}
          recommendationStatus={recommendationStatus}
          selectedDate={selectedDate}
          selectedDepartmentId={selectedDepartmentId}
          selectedDoctorId={selectedDoctorId}
          selectedDoctorName={selectedDoctorName}
          selectedPaymentPolicy={selectedPaymentPolicy}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          slotStatus={slotStatus}
          slots={slots}
          upcomingDays={upcomingDays}
        />

        {user?.role === 'PATIENT' ? (
          <PatientAppointmentHistoryPanel
            actionId={appointmentActionId}
            appointments={appointments}
            onCancel={(appointment) => {
              void cancelMyAppointment(appointment)
            }}
            onPay={openPaymentModal}
            onRefresh={() => {
              void loadAppointments(appointmentPagination.page)
            }}
            status={appointmentStatus}
          />
        ) : (
          <aside className="rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_22px_58px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:col-span-5">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Gửi đặt lịch</h2>
            <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">
              Bạn có thể xem lịch khám trống gần nhất tại đây. Để gửi yêu cầu đặt lịch và theo dõi lịch hẹn, hãy đăng nhập bằng tài khoản bệnh nhân.
            </p>
          </aside>
        )}
      </div>
    </main>
    {paymentModalPayment && (
      <PaymentModal
        initialPayment={paymentModalPayment}
        onClose={closePaymentModal}
      />
    )}
  </div>
)

export default PatientAppointmentsTemplate
