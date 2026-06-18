import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import Select from '../../Molecules/Common/Select'
import type { DoctorManagementRowData } from '../../Molecules/Management/DoctorManagementRow'
import { buildEmptySlotForm, getDateKey, slotStatusOptions } from '../../../utils/doctorSchedule'
import type { SlotFormState } from '../../../utils/doctorSchedule'

export type DoctorScheduleFormValues = SlotFormState

type DoctorScheduleModalProps = {
  doctor: DoctorManagementRowData | null
  error?: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: DoctorScheduleFormValues) => void
  open: boolean
}

const DoctorScheduleModal = ({
  doctor,
  error,
  isSaving,
  onClose,
  onSubmit,
  open,
}: DoctorScheduleModalProps) => {
  const todayKey = useMemo(() => getDateKey(new Date()), [])
  const [form, setForm] = useState<SlotFormState>(() => buildEmptySlotForm(todayKey))

  if (!open || !doctor) return null

  const activeAssignmentReady = Boolean(doctor.activeAssignmentId)

  const handleFieldChange = (field: keyof SlotFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm" role="presentation">
      <button aria-label="Dong hop thoai" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-xl bg-surface-container-lowest p-xl shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="mb-xl flex items-start justify-between gap-lg border-b border-outline-variant/30 pb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Tạo lịch khám</h2>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{doctor.name} - {doctor.specialty || 'Chua co khoa'}</p>
          </div>
          <Button
            aria-label="Dong"
            className="rounded-full border-none p-sm text-on-surface-variant shadow-none hover:bg-surface-container-high"
            fullWidth={false}
            onClick={onClose}
            type="button"
            variant="ghost"
          >
            <Icon name="close" />
          </Button>
        </div>

        <div className="space-y-lg">
          {!activeAssignmentReady && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              Bác sĩ này chưa có khoa đang hoạt động. Hãy sửa bác sĩ và gắn khoa trước khi tạo lịch.
            </p>
          )}
          {error && <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">{error}</p>}

          <Input
            id="admin-slot-date"
            label="Ngày khám"
            min={todayKey}
            onChange={(event) => handleFieldChange('date', event.target.value)}
            required
            type="date"
            value={form.date}
          />
          <div className="grid grid-cols-2 gap-md">
            <Input
              id="admin-slot-start"
              label="Bắt đầu"
              onChange={(event) => handleFieldChange('startTime', event.target.value)}
              required
              type="time"
              value={form.startTime}
            />
            <Input
              id="admin-slot-end"
              label="Kết thúc"
              onChange={(event) => handleFieldChange('endTime', event.target.value)}
              required
              type="time"
              value={form.endTime}
            />
          </div>
          <Input
            id="admin-slot-max-patients"
            inputMode="numeric"
            label="Sức chứa"
            min={1}
            onChange={(event) => handleFieldChange('maxPatients', event.target.value)}
            required
            type="number"
            value={form.maxPatients}
          />
          <Select
            id="admin-slot-status"
            label="Trạng thái"
            onChange={(value) => handleFieldChange('status', value)}
            options={slotStatusOptions}
            value={form.status}
          />
        </div>

        <div className="mt-xl flex justify-end gap-md border-t border-outline-variant/30 pt-lg">
          <Button className="px-lg py-sm" fullWidth={false} onClick={onClose} type="button" variant="ghost">
            Hủy
          </Button>
          <Button className="px-lg py-sm" disabled={!activeAssignmentReady} fullWidth={false} isLoading={isSaving} type="submit">
            Tạo lịch
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DoctorScheduleModal
