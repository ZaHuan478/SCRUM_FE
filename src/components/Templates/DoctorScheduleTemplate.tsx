import DoctorScheduleDayPicker from '../Organisms/DoctorSchedule/DoctorScheduleDayPicker'
import DoctorScheduleForm from '../Organisms/DoctorSchedule/DoctorScheduleForm'
import DoctorScheduleSlotList from '../Organisms/DoctorSchedule/DoctorScheduleSlotList'
import DoctorScheduleStatsGrid from '../Organisms/DoctorSchedule/DoctorScheduleStatsGrid'
import DoctorScheduleTopBar from '../Organisms/DoctorSchedule/DoctorScheduleTopBar'
import DoctorSideNav from '../Organisms/DoctorSchedule/DoctorSideNav'
import type { DoctorScheduleState } from '../../hooks/useDoctorSchedule'
import type { User } from '../../services/auth.service'

type DoctorScheduleTemplateProps = DoctorScheduleState & {
  storedUser: User
  onLogout: () => void
}

const DoctorScheduleTemplate = ({
  activeAssignment,
  dayAction,
  daySummaryMap,
  doctor,
  editingSlot,
  error,
  form,
  handleDateChange,
  handleDeleteSlot,
  handleEditSlot,
  handleMarkDayBusy,
  handleMarkDayFree,
  handleSlotStatusChange,
  handleSlotSubmit,
  isSaving,
  loadSchedule,
  resetForm,
  scheduleStats,
  selectedDate,
  selectedDateLabel,
  selectedDaySlots,
  selectedSummary,
  slotActionId,
  status,
  storedUser,
  success,
  todayKey,
  upcomingDays,
  updateField,
  onLogout,
}: DoctorScheduleTemplateProps) => (
  <div className="flex min-h-screen bg-background text-on-background">
    <DoctorSideNav onLogout={onLogout} />
    <div className="flex min-w-0 flex-grow flex-col">
      <DoctorScheduleTopBar doctor={doctor} onLogout={onLogout} user={storedUser} />

      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-xl px-lg py-lg md:px-xxl md:py-xxl">
        {(error || success) && (
          <p className={`rounded-lg px-md py-sm font-body-sm text-body-sm ${error ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
            {error || success}
          </p>
        )}

        {status === 'loading' && (
          <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
            Đang tải lịch khám...
          </p>
        )}

        <DoctorScheduleStatsGrid stats={scheduleStats} />

        <DoctorScheduleDayPicker
          dayAction={dayAction}
          daySummaryMap={daySummaryMap}
          onDateChange={handleDateChange}
          onMarkDayBusy={() => {
            void handleMarkDayBusy()
          }}
          onMarkDayFree={() => {
            void handleMarkDayFree()
          }}
          onRefresh={() => {
            void loadSchedule()
          }}
          selectedDate={selectedDate}
          selectedDateLabel={selectedDateLabel}
          status={status}
          todayKey={todayKey}
          upcomingDays={upcomingDays}
        />

        <div className="grid grid-cols-1 items-start gap-xl lg:grid-cols-5">
          <DoctorScheduleForm
            activeAssignmentReady={Boolean(activeAssignment)}
            editingSlot={editingSlot}
            form={form}
            isSaving={isSaving}
            onFieldChange={updateField}
            onReset={resetForm}
            onSubmit={(event) => {
              void handleSlotSubmit(event)
            }}
            status={status}
            todayKey={todayKey}
          />

          <DoctorScheduleSlotList
            onDeleteSlot={(slot) => {
              void handleDeleteSlot(slot)
            }}
            onEditSlot={handleEditSlot}
            onSlotStatusChange={(slot, nextStatus) => {
              void handleSlotStatusChange(slot, nextStatus)
            }}
            selectedDateLabel={selectedDateLabel}
            selectedDaySlots={selectedDaySlots}
            selectedSummary={selectedSummary}
            slotActionId={slotActionId}
          />
        </div>
      </main>
    </div>
  </div>
)

export default DoctorScheduleTemplate
