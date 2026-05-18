import { useEffect, useMemo, useState } from 'react'
import SymptomCheckerTemplate from '../components/Templates/SymptomCheckerTemplate'
import type { SuggestedDepartment } from '../components/Molecules/SymptomChecker/SuggestedDepartmentCard'
import type { SuggestedDoctor } from '../components/Molecules/SymptomChecker/SuggestedDoctorCard'
import type { Doctor } from '../services/doctor.service'
import { getDepartments } from '../services/department.service'
import type { Department } from '../services/department.service'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'
import { recommendDepartmentsBySymptoms } from '../services/departmentSymptomRule.service'
import type { RecommendedDepartment } from '../services/departmentSymptomRule.service'
import { getSymptoms } from '../services/symptom.service'
import type { Symptom } from '../services/symptom.service'
import { findMatchingSymptoms } from '../utils/patientAppointments'

const getTitleFromDoctor = (doctor: Doctor) => {
  const description = doctor.description?.trim()

  return description ? description.split(/[,.]/)[0].slice(0, 56) : ''
}

const mapDoctor = (doctor: Doctor, departmentName?: string): SuggestedDoctor => {
  const experience = Number(doctor.experience_years || 0)

  return {
    name: doctor.user?.full_name || '',
    title: getTitleFromDoctor(doctor),
    tags: [
      ...(departmentName ? [departmentName] : []),
      ...(experience > 0 ? [`${experience} năm kinh nghiệm`] : []),
    ],
    image: doctor.image_url || '',
  }
}

const loadActiveSymptoms = async () => {
  const firstPage = await getSymptoms({ limit: 100, status: 'ACTIVE' })
  if (firstPage.pagination.total_pages <= 1) return firstPage.symptoms

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pagination.total_pages - 1 }, (_, index) => (
      getSymptoms({ limit: 100, page: index + 2, status: 'ACTIVE' })
    ))
  )

  return [
    ...firstPage.symptoms,
    ...remainingPages.flatMap((result) => result.symptoms),
  ]
}

const mapRecommendedDepartment = (
  recommendation: RecommendedDepartment,
  departments: Department[]
): SuggestedDepartment => {
  const department = departments.find((item) => String(item.id) === String(recommendation.department_id))
  const matchedSymptoms = recommendation.matched_symptoms.join(', ')

  return {
    title: recommendation.department_name,
    description: matchedSymptoms
      ? `Phù hợp với: ${matchedSymptoms}`
      : department?.description || 'Khoa phù hợp với triệu chứng bạn đã nhập.',
  }
}

const uniqueDoctorAssignments = (assignments: DoctorAssignment[]) => {
  const seenDoctorIds = new Set<string>()

  return assignments.filter((assignment) => {
    const doctorId = String(assignment.doctor_id)
    if (seenDoctorIds.has(doctorId)) return false

    seenDoctorIds.add(doctorId)
    return true
  })
}

const SymptomCheckerPage = () => {
  const [query, setQuery] = useState('')
  const [allDepartments, setAllDepartments] = useState<Department[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [departments, setDepartments] = useState<SuggestedDepartment[]>([])
  const [doctors, setDoctors] = useState<SuggestedDoctor[]>([])
  const [doctorStatus, setDoctorStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    Promise.all([
      loadActiveSymptoms(),
      getDepartments({ limit: 100, status: 'ACTIVE' }),
      getDoctorAssignments({ limit: 100, status: 'ACTIVE' }),
    ])
      .then(([nextSymptoms, departmentResult, assignmentResult]) => {
        if (!active) return

        setSymptoms(nextSymptoms)
        setAllDepartments(departmentResult.departments)
        setDepartments(departmentResult.departments.slice(0, 3).map((department) => ({
          title: department.name,
          description: department.description || 'Khoa đang tiếp nhận lịch khám.',
        })))
        setDoctors(uniqueDoctorAssignments(assignmentResult.doctor_assignments)
          .filter((assignment) => assignment.doctor)
          .slice(0, 4)
          .map((assignment) => mapDoctor(assignment.doctor as Doctor, assignment.department?.name)))
        setDoctorStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setSymptoms([])
        setDepartments([])
        setDoctors([])
        setDoctorStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const searchSuggestions = useMemo(() => (
    findMatchingSymptoms(query, symptoms).slice(0, 6).map((symptom) => symptom.name)
  ), [query, symptoms])

  const handleSearch = async (nextQuery = query) => {
    const matchedSymptoms = findMatchingSymptoms(nextQuery, symptoms).slice(0, 8)

    if (matchedSymptoms.length === 0) {
      setDepartments([])
      setDoctors([])
      setDoctorStatus('ready')
      document.getElementById('symptom-results')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setDoctorStatus('loading')

    try {
      const recommendations = (await recommendDepartmentsBySymptoms(
        matchedSymptoms.map((symptom) => symptom.id)
      )).slice(0, 4)
      const assignments = (await Promise.all(
        recommendations.map((recommendation) => (
          getDoctorAssignments({
            department_id: recommendation.department_id,
            limit: 10,
            status: 'ACTIVE',
          })
        ))
      )).flatMap((result) => result.doctor_assignments)

      setDepartments(recommendations.map((recommendation) => (
        mapRecommendedDepartment(recommendation, allDepartments)
      )))
      setDoctors(uniqueDoctorAssignments(assignments)
        .filter((assignment) => assignment.doctor)
        .slice(0, 4)
        .map((assignment) => mapDoctor(assignment.doctor as Doctor, assignment.department?.name)))
      setDoctorStatus('ready')
    } catch {
      setDepartments([])
      setDoctors([])
      setDoctorStatus('error')
    }

    document.getElementById('symptom-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion)
    window.setTimeout(() => {
      void handleSearch(suggestion)
    }, 0)
  }

  return (
    <SymptomCheckerTemplate
      departments={departments}
      doctorStatus={doctorStatus}
      doctors={doctors}
      onQueryChange={setQuery}
      onSearch={() => {
        void handleSearch()
      }}
      onSuggestionSelect={handleSuggestionSelect}
      query={query}
      searchSuggestions={searchSuggestions}
    />
  )
}

export default SymptomCheckerPage
