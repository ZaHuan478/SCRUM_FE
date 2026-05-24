import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import Select from '../../Molecules/Common/Select'
import type { AppointmentSlot } from '../../../services/appointmentSlot.service'
import { slotStatusOptions } from '../../../utils/doctorSchedule'
import type { LoadStatus, SlotFormState } from '../../../utils/doctorSchedule'

type DoctorScheduleFormProps = {
  activeAssignmentReady: boolean
  editingSlot: AppointmentSlot | null
  form: SlotFormState
  isSaving: boolean
  status: LoadStatus
  todayKey: string
  onFieldChange: (field: keyof SlotFormState, value: string) => void
  onReset: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const DoctorScheduleForm = ({
  activeAssignmentReady,
  editingSlot,
  form,
  isSaving,
  status,
  todayKey,
  onFieldChange,
  onReset,
  onSubmit,
}: DoctorScheduleFormProps) => (
  <form className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-2" onSubmit={onSubmit}>
    <div className="mb-lg flex items-center gap-sm">
      <Icon className="text-primary" name={editingSlot ? 'edit_calendar' : 'add_circle'} />
      <h2 className="font-headline-sm text-headline-sm text-on-surface">
        {editingSlot ? 'Sửa khung giờ' : 'Thêm khung giờ'}
      </h2>
    </div>

    {!activeAssignmentReady && status !== 'loading' && (
      <p className="mb-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
        Chưa có khoa đang hoạt động cho tài khoản bác sĩ này.
      </p>
    )}

    <div className="grid grid-cols-1 gap-md">
      <Input
        label="Ngày khám"
        min={todayKey}
        onChange={(event) => onFieldChange('date', event.target.value)}
        required
        type="date"
        value={form.date}
      />
      <div className="grid grid-cols-2 gap-md">
        <Input
          label="Bắt đầu"
          onChange={(event) => onFieldChange('startTime', event.target.value)}
          required
          type="time"
          value={form.startTime}
        />
        <Input
          label="Kết thúc"
          onChange={(event) => onFieldChange('endTime', event.target.value)}
          required
          type="time"
          value={form.endTime}
        />
      </div>
      <Input
        inputMode="numeric"
        label="Sức chứa"
        min={1}
        onChange={(event) => onFieldChange('maxPatients', event.target.value)}
        required
        type="number"
        value={form.maxPatients}
      />
      <Select
        label="Trạng thái"
        onChange={(value) => onFieldChange('status', value)}
        options={slotStatusOptions}
        value={form.status}
      />
    </div>

    <div className="mt-lg flex flex-col gap-sm sm:flex-row sm:flex-wrap">
      <Button
        className="inline-flex items-center justify-center gap-xs px-lg py-sm"
        disabled={!activeAssignmentReady}
        fullWidth={false}
        isLoading={isSaving}
        type="submit"
      >
        <Icon className="text-lg" name="save" />
        {editingSlot ? 'Lưu thay đổi' : 'Thêm khung giờ'}
      </Button>
      {editingSlot && (
        <Button
          className="px-md py-sm"
          disabled={isSaving}
          fullWidth={false}
          onClick={onReset}
          type="button"
          variant="ghost"
        >
          Hủy sửa
        </Button>
      )}
    </div>
  </form>
)

export default DoctorScheduleForm
