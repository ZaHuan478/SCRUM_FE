import { useEffect, useState } from 'react'
import SymptomCheckerTemplate from '../components/Templates/SymptomCheckerTemplate'
import type { SuggestedDepartment } from '../components/Molecules/SuggestedDepartmentCard'
import type { SuggestedDoctor } from '../components/Molecules/SuggestedDoctorCard'
import { getDoctors } from '../services/doctor.service'
import type { Doctor } from '../services/doctor.service'

const getTitleFromDoctor = (doctor: Doctor) => {
  const description = doctor.description?.trim()

  return description ? description.split(/[,.]/)[0].slice(0, 56) : ''
}

const mapDoctor = (doctor: Doctor): SuggestedDoctor => {
  const experience = Number(doctor.experience_years || 0)

  return {
    name: doctor.user?.full_name || '',
    title: getTitleFromDoctor(doctor),
    tags: experience > 0 ? [`${experience} năm kinh nghiệm`] : [],
    image: doctor.image_url || '',
  }
}

const SymptomCheckerPage = () => {
  const [query, setQuery] = useState('')
  const [departments] = useState<SuggestedDepartment[]>([])
  const [doctors, setDoctors] = useState<SuggestedDoctor[]>([])
  const [doctorStatus, setDoctorStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    getDoctors({ limit: 4, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return

        setDoctors(result.doctors.map(mapDoctor))
        setDoctorStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setDoctors([])
        setDoctorStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const handleSearch = () => {
    document.getElementById('symptom-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion)
    document.getElementById('symptom-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <SymptomCheckerTemplate
      departments={departments}
      doctorStatus={doctorStatus}
      doctors={doctors}
      onQueryChange={setQuery}
      onSearch={handleSearch}
      onSuggestionSelect={handleSuggestionSelect}
      query={query}
    />
  )
}

export default SymptomCheckerPage
