import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import type { Department } from '../../../services/department.service'
import type { DepartmentSymptomRule } from '../../../services/departmentSymptomRule.service'
import type { Symptom } from '../../../services/symptom.service'

export type SymptomRuleFormValues = {
  departmentId: string
  preVisitNote: string | null
  score: string
  symptomId: string
}

type SymptomRuleEditModalProps = {
  departments: Department[]
  error?: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: SymptomRuleFormValues) => void
  open: boolean
  rule: DepartmentSymptomRule | null
  symptoms: Symptom[]
}

const cleanOptional = (value: string) => {
  const trimmedValue = value.trim()
  return trimmedValue || null
}

const SymptomRuleEditModal = ({
  departments,
  error,
  isSaving,
  onClose,
  onSubmit,
  open,
  rule,
  symptoms,
}: SymptomRuleEditModalProps) => {
  const [departmentId, setDepartmentId] = useState(() => String(rule?.department_id || ''))
  const [preVisitNote, setPreVisitNote] = useState(() => rule?.pre_visit_note || '')
  const [score, setScore] = useState(() => String(rule?.score || 8))
  const [symptomId, setSymptomId] = useState(() => String(rule?.symptom_id || ''))
  const isEditing = Boolean(rule)

  if (!open) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      departmentId,
      preVisitNote: cleanOptional(preVisitNote),
      score,
      symptomId,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm" role="presentation">
      <button aria-label="Đóng hộp thoại" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-xl shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="mb-xl flex items-start justify-between gap-lg border-b border-outline-variant/30 pb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{isEditing ? 'Cập nhật ghi chú triệu chứng' : 'Thêm ghi chú triệu chứng'}</h2>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Quản lý khoa gợi ý và lưu ý trước khi khám theo triệu chứng.</p>
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

          <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
            <label className="space-y-xs">
              <span className="font-label-md text-label-md text-on-surface">Triệu chứng</span>
              <select
                className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:bg-surface-container-low"
                disabled={isEditing}
                onChange={(event) => setSymptomId(event.target.value)}
                required
                value={symptomId}
              >
                <option value="">Chọn triệu chứng</option>
                {symptoms.map((symptom) => (
                  <option key={symptom.id} value={symptom.id}>{symptom.name}</option>
                ))}
              </select>
            </label>

            <label className="space-y-xs">
              <span className="font-label-md text-label-md text-on-surface">Khoa</span>
              <select
                className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:bg-surface-container-low"
                disabled={isEditing}
                onChange={(event) => setDepartmentId(event.target.value)}
                required
                value={departmentId}
              >
                <option value="">Chọn khoa</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-xs">
            <span className="font-label-md text-label-md text-on-surface">Điểm ưu tiên</span>
            <input
              className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              max={10}
              min={1}
              onChange={(event) => setScore(event.target.value)}
              required
              type="number"
              value={score}
            />
          </label>

          <label className="block space-y-xs">
            <span className="font-label-md text-label-md text-on-surface">Lưu ý trước khi khám</span>
            <textarea
              className="min-h-32 w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              maxLength={2000}
              onChange={(event) => setPreVisitNote(event.target.value)}
              placeholder="Ví dụ: Nếu khám tiêu hóa, nên nhịn ăn sáng và mang theo kết quả nội soi/xét nghiệm cũ nếu có."
              value={preVisitNote}
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">{preVisitNote.length}/2000 ký tự</span>
          </label>
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

export default SymptomRuleEditModal
