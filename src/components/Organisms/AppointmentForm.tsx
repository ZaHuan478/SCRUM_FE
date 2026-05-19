import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../Atoms/Button'
import Input from '../Atoms/Input'
import type { SelectOption } from '../../data/appointment'
import { getStoredUser } from '../../services/auth.service'

type AppointmentFormProps = {
  insuranceProviders: SelectOption[]
  submitLabel: string
}

type PatientFormState = {
  fullName: string
  email: string
  phone: string
  insurance: string
  reason: string
}

const AppointmentForm = ({ insuranceProviders, submitLabel }: AppointmentFormProps) => {
  const storedUser = getStoredUser()
  const [form, setForm] = useState<PatientFormState>({
    fullName: storedUser?.full_name || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    insurance: '',
    reason: '',
  })
  const [message, setMessage] = useState('')

  const updateField = (field: keyof PatientFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('Thông tin đã sẵn sàng để xác nhận lịch hẹn.')
  }

  return (
    <section className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-lg shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
      <h3 className="mb-lg font-headline-sm text-headline-sm text-on-surface">Thông tin bệnh nhân</h3>
      <form className="space-y-lg" onSubmit={handleSubmit}>
        {message && <p className="rounded-lg bg-secondary-fixed px-md py-sm font-body-sm text-body-sm text-on-secondary-fixed">{message}</p>}
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <Input
            autoComplete="name"
            id="appointment-full-name"
            label="Họ và tên"
            name="fullName"
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder="VD: Nguyễn Văn A"
            type="text"
            value={form.fullName}
          />
          <Input
            autoComplete="email"
            id="appointment-email"
            label="Địa chỉ email"
            name="email"
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="email@vi-du.com"
            type="email"
            value={form.email}
          />
          <Input
            autoComplete="tel"
            id="appointment-phone"
            label="Số điện thoại"
            name="phone"
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="+84 000 000 000"
            type="tel"
            value={form.phone}
          />
          <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="appointment-insurance">
              Bảo hiểm
            </label>
            <select
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-md font-body-md text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              id="appointment-insurance"
              name="insurance"
              onChange={(event) => updateField('insurance', event.target.value)}
              value={form.insurance}
            >
              {insuranceProviders.map((provider) => (
                <option key={provider.value || 'empty'} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-xs">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="appointment-reason">
            Lý do khám
          </label>
          <textarea
            className="min-h-32 w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-md font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/10"
            id="appointment-reason"
            name="reason"
            onChange={(event) => updateField('reason', event.target.value)}
            placeholder="Mô tả ngắn gọn triệu chứng hoặc lý do đặt hẹn..."
            value={form.reason}
          />
        </div>
        <Button className="lg:hidden" type="submit">{submitLabel}</Button>
      </form>
    </section>
  )
}

export default AppointmentForm
