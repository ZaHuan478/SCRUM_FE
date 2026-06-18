import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import GenderSelect from '../../Molecules/Common/GenderSelect'
import type { UserGender } from '../../../services/auth.service'
import type { PatientManagementRowData } from '../../Molecules/Management/PatientManagementRow'

export type PatientEditFormValues = {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: UserGender | ''
  address: string
  insuranceNumber: string
}

type PatientEditModalProps = {
  error?: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: PatientEditFormValues) => void
  open: boolean
  patient: PatientManagementRowData | null
}

const PatientEditModal = ({
  error,
  isSaving,
  onClose,
  onSubmit,
  open,
  patient,
}: PatientEditModalProps) => {
  const [fullName, setFullName] = useState(() => patient?.name || '')
  const [email, setEmail] = useState(() => patient?.email || '')
  const [phone, setPhone] = useState(() => patient?.phone || '')
  const [dateOfBirth, setDateOfBirth] = useState(() => patient?.dateOfBirth || '')
  const [gender, setGender] = useState<UserGender | ''>(() => patient?.gender || '')
  const [address, setAddress] = useState(() => patient?.address || '')
  const [insuranceNumber, setInsuranceNumber] = useState(() => patient?.insuranceNumber || '')

  if (!open || !patient) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth,
      gender,
      address: address.trim(),
      insuranceNumber: insuranceNumber.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm" role="presentation">
      <button aria-label="Dong hop thoai" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-xl shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="mb-xl flex items-start justify-between gap-lg border-b border-outline-variant/30 pb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Cập nhật bệnh nhân</h2>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{patient.email || patient.name}</p>
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
          {error && <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">{error}</p>}
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <Input id="patient-full-name" label="Họ và tên" onChange={(event) => setFullName(event.target.value)} required type="text" value={fullName} />
            <Input id="patient-email" label="Email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            <Input id="patient-phone" label="Số điện thoại" onChange={(event) => setPhone(event.target.value)} type="tel" value={phone} />
            <Input id="patient-date-of-birth" label="Ngày sinh" onChange={(event) => setDateOfBirth(event.target.value)} type="date" value={dateOfBirth} />
            <GenderSelect
              className="min-h-11 rounded bg-surface py-sm shadow-none focus:border-on-surface focus:ring-0"
              id="patient-gender"
              onChange={setGender}
              value={gender}
            />
            <Input id="patient-insurance-number" label="Số bảo hiểm" onChange={(event) => setInsuranceNumber(event.target.value)} type="text" value={insuranceNumber} />
          </div>

          <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="patient-address">
              Địa chỉ
            </label>
            <textarea
              className="min-h-28 w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              id="patient-address"
              onChange={(event) => setAddress(event.target.value)}
              value={address}
            />
          </div>
        </div>

        <div className="mt-xl flex justify-end gap-md border-t border-outline-variant/30 pt-lg">
          <Button className="px-lg py-sm" fullWidth={false} onClick={onClose} type="button" variant="ghost">
            Hủy
          </Button>
          <Button className="px-lg py-sm" fullWidth={false} isLoading={isSaving} type="submit">
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PatientEditModal
