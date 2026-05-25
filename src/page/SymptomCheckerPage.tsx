import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from '../contexts/LanguageContext'
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
import {
  translateDepartmentDescription,
  translateDepartmentName,
  translateDoctorDescription,
} from '../utils/contentTranslation'
import { findMatchingSymptoms } from '../utils/patientAppointments'
import type { Language } from '../contexts/LanguageContext'

type Translate = (key: string, values?: Record<string, string | number>) => string

const getTitleFromDoctor = (doctor: Doctor, language: Language) => {
  const description = translateDoctorDescription(doctor.description, language).trim()

  return description ? description.split(/[,.]/)[0].slice(0, 56) : ''
}

const mapDoctor = (doctor: Doctor, departmentName: string | undefined, t: Translate, language: Language): SuggestedDoctor => {
  const experience = Number(doctor.experience_years || 0)

  return {
    id: doctor.id,
    name: doctor.user?.full_name || '',
    title: getTitleFromDoctor(doctor, language),
    tags: [
      ...(departmentName ? [translateDepartmentName(departmentName, language)] : []),
      ...(experience > 0 ? [t('common.yearsExperience', { years: experience })] : []),
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
  departments: Department[],
  t: Translate,
  language: Language
): SuggestedDepartment => {
  const department = departments.find((item) => String(item.id) === String(recommendation.department_id))
  const matchedSymptoms = recommendation.matched_symptoms.join(', ')
  const preVisitNotes = (recommendation.pre_visit_notes || [])
    .map((note) => ({
      note: note.note.trim(),
      symptomName: note.symptom_name?.trim(),
    }))
    .filter((note) => note.note)

  return {
    title: translateDepartmentName(recommendation.department_name, language),
    description: matchedSymptoms
      ? t('symptomChecker.matchingSymptoms', { symptoms: matchedSymptoms })
      : department?.description
        ? translateDepartmentDescription(department.description, language)
        : t('symptomChecker.fallbackDepartmentDescription'),
    preVisitNote: recommendation.pre_visit_note || preVisitNotes[0]?.note || null,
    preVisitNotes,
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
  const { language, t } = useTranslation()
  const [query, setQuery] = useState('')
  const [allDepartments, setAllDepartments] = useState<Department[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [analyzed, setAnalyzed] = useState(false)
  const [analyzedSymptoms, setAnalyzedSymptoms] = useState<Symptom[]>([])
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
          title: translateDepartmentName(department.name, language),
          description: department.description
            ? translateDepartmentDescription(department.description, language)
            : t('symptomChecker.activeDepartmentFallback'),
        })))
        setDoctors(uniqueDoctorAssignments(assignmentResult.doctor_assignments)
          .filter((assignment) => assignment.doctor)
          .slice(0, 4)
          .map((assignment) => mapDoctor(assignment.doctor as Doctor, assignment.department?.name, t, language)))
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
  }, [language, t])

  const searchSuggestions = useMemo(() => (
    findMatchingSymptoms(query, symptoms).slice(0, 6).map((symptom) => symptom.name)
  ), [query, symptoms])

  const handleSearch = async (nextQuery = query) => {
    const matchedSymptoms = findMatchingSymptoms(nextQuery, symptoms).slice(0, 8)
    setAnalyzed(true)
    setAnalyzedSymptoms(matchedSymptoms)

    if (matchedSymptoms.length === 0) {
      setDepartments([])
      setDoctors([])
      setDoctorStatus('ready')
      document.getElementById('symptom-analysis')?.scrollIntoView({ behavior: 'smooth' })
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
        mapRecommendedDepartment(recommendation, allDepartments, t, language)
      )))
      setDoctors(uniqueDoctorAssignments(assignments)
        .filter((assignment) => assignment.doctor)
        .slice(0, 4)
        .map((assignment) => mapDoctor(assignment.doctor as Doctor, assignment.department?.name, t, language)))
      setDoctorStatus('ready')
    } catch {
      setDepartments([])
      setDoctors([])
      setDoctorStatus('error')
    }

    document.getElementById('symptom-analysis')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion)
    window.setTimeout(() => {
      void handleSearch(suggestion)
    }, 0)
  }

  return (
    <SymptomCheckerTemplate
      analyzed={analyzed}
      analyzedSymptoms={analyzedSymptoms}
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
