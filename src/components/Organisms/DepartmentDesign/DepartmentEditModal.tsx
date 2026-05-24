import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import Select from '../../Molecules/Common/Select'
import type { Department } from '../../../services/department.service'

export type DepartmentFormValues = {
  name: string
  description: string | null
  status: 'ACTIVE' | 'INACTIVE'
}

type DepartmentEditModalProps = {
  department: Department | null
  open: boolean
  error?: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: DepartmentFormValues) => void
}

const cleanOptional = (value: string) => {
  const trimmedValue = value.trim()
  return trimmedValue || null
}

const DepartmentEditModal = ({
  department,
  open,
  error,
  isSaving,
  onClose,
  onSubmit,
}: DepartmentEditModalProps) => {
  const [name, setName] = useState(() => department?.name || '')
  const [description, setDescription] = useState(() => department?.description || '')
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(() => department?.status || 'ACTIVE')
  const isEditing = Boolean(department)

  if (!open) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      name: name.trim(),
      description: cleanOptional(description),
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm" role="presentation">
      <button aria-label="Đóng hộp thoại" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-xl shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="mb-xl flex items-start justify-between gap-lg border-b border-outline-variant/30 pb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{isEditing ? 'Cập nhật khoa' : 'Thêm khoa'}</h2>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Quản lý danh mục khoa dùng để gợi ý triệu chứng và phân công bác sĩ.</p>
          </div>
          <Button
            aria-label="Đóng"
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
          <Input
            id="department-name"
            label="Tên khoa"
            onChange={(event) => setName(event.target.value)}
            placeholder="Khoa Tim mạch"
            required
            type="text"
            value={name}
          />
          <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="department-description">
              Mô tả
            </label>
            <textarea
              className="min-h-28 w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              id="department-description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Mô tả phạm vi khám và điều trị"
              value={description}
            />
          </div>
          <Select
            id="department-status"
            label="Trạng thái"
            onChange={(value) => setStatus(value as 'ACTIVE' | 'INACTIVE')}
            options={[
              { label: 'Đang hoạt động', value: 'ACTIVE' },
              { label: 'Tạm ngưng', value: 'INACTIVE' },
            ]}
            value={status}
          />
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

export default DepartmentEditModal
