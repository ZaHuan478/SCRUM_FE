import { useEffect, useState } from 'react'
import DepartmentCard from '../Molecules/DepartmentCard'
import { getDepartments } from '../../services/department.service'
import type { Department } from '../../services/department.service'

const tones: Array<'primary' | 'secondary' | 'tertiary' | 'neutral'> = ['primary', 'secondary', 'tertiary', 'neutral']

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    getDepartments({ limit: 8, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return
        setDepartments(result.departments)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setDepartments([])
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  if (status === 'ready' && departments.length === 0) return null

  return (
    <section className="bg-surface-container-low px-lg py-xxxl md:px-xxl" id="departments">
      <div className="mx-auto max-w-7xl">
        <div className="mb-xxl text-center">
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Khoa chuyên môn</h2>
          <p className="mx-auto max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Danh mục khoa đang hoạt động trong hệ thống.
          </p>
        </div>
        {status === 'loading' && (
          <p className="rounded-lg border border-outline-variant/30 bg-surface px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
            Đang tải danh sách khoa...
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            Chưa kết nối được backend nên chưa có dữ liệu khoa để hiển thị.
          </p>
        )}
        {departments.length > 0 && (
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            {departments.map((department, index) => (
              <DepartmentCard
                icon="clinical_notes"
                key={department.id}
                label={department.name}
                tone={tones[index % tones.length]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DepartmentsSection
