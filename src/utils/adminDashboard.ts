import type { AdminInfoField } from '../components/Organisms/Admin/AdminInfoModal'
import type { AnalyticsPoint } from '../components/Organisms/Dashboard/AppointmentAnalyticsSection'
import type { DoctorDepartmentOption } from '../components/Organisms/DoctorManage/DoctorEditModal'
import type { DashboardStat } from '../components/Molecules/Dashboard/DashboardStatCard'
import type { DoctorManagementRowData } from '../components/Molecules/Management/DoctorManagementRow'
import type { PatientManagementRowData } from '../components/Molecules/Management/PatientManagementRow'
import type { AppointmentsResult } from '../services/appointment.service'
import type { AppointmentSlotsResult } from '../services/appointmentSlot.service'
import type { User } from '../services/auth.service'
import type { Department, DepartmentsResult } from '../services/department.service'
import type { DepartmentSymptomRule, DepartmentSymptomRulesResult } from '../services/departmentSymptomRule.service'
import type { DoctorAssignmentsResult } from '../services/doctorAssignment.service'
import type { Doctor, DoctorsResult } from '../services/doctor.service'
import type { PatientsResult } from '../services/patient.service'
import type { SymptomsResult } from '../services/symptom.service'
import type { UsersResult } from '../services/user.service'

export type LoadStatus = 'loading' | 'ready' | 'error'

export type DashboardPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type DashboardState = {
  analyticsData: AnalyticsPoint[]
  analyticsStatus: LoadStatus
  departments: Department[]
  departmentPagination: DashboardPagination
  departmentStatus: LoadStatus
  symptomRules: DepartmentSymptomRule[]
  symptomRulePagination: DashboardPagination
  symptomRuleStatus: LoadStatus
  symptomOptions: SymptomsResult['symptoms']
  doctors: DoctorManagementRowData[]
  doctorPagination: DashboardPagination
  doctorStatus: LoadStatus
  patients: PatientManagementRowData[]
  patientPagination: DashboardPagination
  patientStatus: LoadStatus
  users: User[]
  userPagination: DashboardPagination
  userStatus: LoadStatus
  departmentOptions: DoctorDepartmentOption[]
  stats: DashboardStat[]
  statsStatus: LoadStatus
  totalDepartments: number
  totalSymptomRules: number
  totalDoctors: number
  totalPatients: number
  totalUsers: number
}

export const emptyDashboardPagination: DashboardPagination = {
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 0,
}

export const toDashboardPagination = (
  pagination?: DepartmentsResult['pagination'] | DepartmentSymptomRulesResult['pagination'] | DoctorsResult['pagination'] | PatientsResult['pagination'] | UsersResult['pagination']
): DashboardPagination => ({
  page: pagination?.page || emptyDashboardPagination.page,
  limit: pagination?.limit || emptyDashboardPagination.limit,
  total: pagination?.total || emptyDashboardPagination.total,
  totalPages: pagination?.total_pages || emptyDashboardPagination.totalPages,
})

export const emptyDashboardState: DashboardState = {
  analyticsData: [],
  analyticsStatus: 'loading',
  departments: [],
  departmentPagination: emptyDashboardPagination,
  departmentStatus: 'loading',
  symptomRules: [],
  symptomRulePagination: emptyDashboardPagination,
  symptomRuleStatus: 'loading',
  symptomOptions: [],
  doctors: [],
  doctorPagination: emptyDashboardPagination,
  doctorStatus: 'loading',
  patients: [],
  patientPagination: emptyDashboardPagination,
  patientStatus: 'loading',
  users: [],
  userPagination: emptyDashboardPagination,
  userStatus: 'loading',
  departmentOptions: [],
  stats: [],
  statsStatus: 'loading',
  totalDepartments: 0,
  totalSymptomRules: 0,
  totalDoctors: 0,
  totalPatients: 0,
  totalUsers: 0,
}

export const dashboardErrorState: DashboardState = {
  ...emptyDashboardState,
  analyticsStatus: 'error',
  departmentStatus: 'error',
  symptomRuleStatus: 'error',
  doctorStatus: 'error',
  patientStatus: 'error',
  userStatus: 'error',
  statsStatus: 'error',
}

const numberFormatter = new Intl.NumberFormat('vi-VN')
const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  weekday: 'short',
})

export const getFulfilledValue = <T,>(result: PromiseSettledResult<T>) => (
  result.status === 'fulfilled' ? result.value : undefined
)

const formatCount = (value?: number) => (
  value === undefined ? 'N/A' : numberFormatter.format(value)
)

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const buildLastSevenDays = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - 6 + index)

    return date
  })
}

const toValidDate = (value?: string | null) => {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

const incrementByDate = (counts: Map<string, number>, value?: string | null, amount = 1) => {
  const date = toValidDate(value)
  if (!date) return

  const key = getDateKey(date)
  if (!counts.has(key)) return

  counts.set(key, (counts.get(key) || 0) + amount)
}

export const buildAnalyticsData = (
  appointments?: AppointmentsResult,
  slots?: AppointmentSlotsResult
): AnalyticsPoint[] => {
  const days = buildLastSevenDays()
  const counts = new Map(days.map((date) => [getDateKey(date), 0]))

  if (appointments) {
    appointments.appointments.forEach((appointment) => {
      incrementByDate(counts, appointment.slot?.start_time || appointment.created_at)
    })
  } else {
    slots?.appointment_slots.forEach((slot) => {
      incrementByDate(counts, slot.start_time, Number(slot.booked_count || 0))
    })
  }

  return days.map((date) => ({
    label: dateFormatter.format(date),
    value: counts.get(getDateKey(date)) || 0,
  }))
}

const buildDoctorWeeklyCounts = (
  appointments?: AppointmentsResult,
  slots?: AppointmentSlotsResult
) => {
  const days = new Set(buildLastSevenDays().map(getDateKey))
  const counts = new Map<string, number>()

  if (appointments) {
    appointments.appointments.forEach((appointment) => {
      const date = toValidDate(appointment.slot?.start_time || appointment.created_at)
      if (!date || !days.has(getDateKey(date))) return

      const doctorId = String(appointment.doctor_id)
      counts.set(doctorId, (counts.get(doctorId) || 0) + 1)
    })

    return counts
  }

  slots?.appointment_slots.forEach((slot) => {
    const date = toValidDate(slot.start_time)
    if (!date || !days.has(getDateKey(date))) return

    const doctorId = slot.doctor_assignment?.doctor_id
    if (!doctorId) return

    const key = String(doctorId)
    counts.set(key, (counts.get(key) || 0) + Number(slot.booked_count || 0))
  })

  return counts
}

const buildDoctorAssignmentMap = (assignments?: DoctorAssignmentsResult) => {
  const assignmentMap = new Map<string, DoctorAssignmentsResult['doctor_assignments'][number]>()

  assignments?.doctor_assignments.forEach((assignment) => {
    if (assignment.status !== 'ACTIVE') return

    const doctorId = String(assignment.doctor_id)
    if (!assignmentMap.has(doctorId)) {
      assignmentMap.set(doctorId, assignment)
    }
  })

  return assignmentMap
}

export const buildDepartmentOptions = (departments?: DepartmentsResult): DoctorDepartmentOption[] => (
  (departments?.departments || []).map((department) => ({
    departmentId: department.id,
    label: department.name,
  })).filter((option) => option.label)
)

const specialtyFromDescription = (doctor: Doctor) => {
  const description = doctor.description?.trim()

  return description ? description.split(/[,.]/)[0].slice(0, 42) : undefined
}

export const mapDoctors = (
  doctorsResult?: DoctorsResult,
  appointments?: AppointmentsResult,
  slots?: AppointmentSlotsResult,
  assignments?: DoctorAssignmentsResult
): DoctorManagementRowData[] => {
  const weeklyCounts = buildDoctorWeeklyCounts(appointments, slots)
  const activeAssignments = buildDoctorAssignmentMap(assignments)

  return (doctorsResult?.doctors || []).map((doctor) => {
    const doctorId = String(doctor.id)
    const assignment = activeAssignments.get(doctorId)
    const department = assignment?.department

    return {
      id: doctor.id,
      userId: doctor.user_id,
      name: doctor.user?.full_name || doctor.license_number,
      email: doctor.user?.email,
      phone: doctor.user?.phone,
      licenseNumber: doctor.license_number,
      cccd: doctor.cccd,
      activeAssignmentId: assignment?.id,
      departmentId: department?.id,
      specialty: department?.name || specialtyFromDescription(doctor),
      status: doctor.status,
      experienceYears: doctor.experience_years,
      consultationFee: doctor.consultation_fee === undefined || doctor.consultation_fee === null
        ? null
        : String(doctor.consultation_fee),
      description: doctor.description,
      profBiography: doctor.prof_biography,
      appointmentsThisWeek: weeklyCounts.get(doctorId) || 0,
      image: doctor.image_url,
    }
  })
}

export const mapPatients = (patientsResult?: PatientsResult): PatientManagementRowData[] => (
  (patientsResult?.patients || []).map((patient) => ({
    id: patient.id,
    name: patient.user?.full_name || `BN-${patient.id}`,
    email: patient.user?.email,
    phone: patient.user?.phone,
    dateOfBirth: patient.date_of_birth,
    gender: patient.gender,
    address: patient.address,
    insuranceNumber: patient.insurance_number,
  }))
)

export const buildStats = ({
  activeDoctors,
  appointments,
  availableSlots,
  departments,
  doctors,
  patients,
  slots,
}: {
  activeDoctors?: DoctorsResult
  appointments?: AppointmentsResult
  availableSlots?: AppointmentSlotsResult
  departments?: DepartmentsResult
  doctors?: DoctorsResult
  patients?: PatientsResult
  slots?: AppointmentSlotsResult
}): DashboardStat[] => {
  const appointmentTotal = appointments?.pagination.total
  const slotTotal = slots?.pagination.total
  const pendingAppointments = appointments?.appointments.filter((appointment) => appointment.status === 'PENDING').length
  const activeDoctorTotal = activeDoctors?.pagination.total
    ?? doctors?.doctors.filter((doctor) => doctor.status === 'ACTIVE').length

  return [
    {
      icon: 'event_available',
      label: appointmentTotal === undefined ? 'Lịch khám đã mở' : 'Tổng lịch hẹn',
      value: formatCount(appointmentTotal ?? slotTotal),
      helper: appointmentTotal === undefined
        ? `${formatCount(availableSlots?.pagination.total)} còn trống`
        : `${formatCount(pendingAppointments)} đang chờ`,
      tone: 'primary',
    },
    {
      icon: 'medical_services',
      label: 'Bác sĩ đang hoạt động',
      value: formatCount(activeDoctorTotal),
      helper: `${formatCount(departments?.pagination.total)} chuyên khoa`,
      tone: 'secondary',
    },
    {
      icon: 'groups',
      label: 'Bệnh nhân',
      value: formatCount(patients?.pagination.total),
      helper: 'Hồ sơ',
      tone: 'success',
    },
    {
      icon: 'clinical_notes',
      label: 'Chuyên khoa',
      value: formatCount(departments?.pagination.total),
      helper: 'Đang hoạt động',
      tone: 'tertiary',
    },
  ]
}

export const getUserInfoFields = (user: User | null): AdminInfoField[] => (
  user
    ? [
      { label: 'Email', value: user.email },
      { label: 'Số điện thoại', value: user.phone },
      { label: 'Vai trò', value: user.role },
      { label: 'Trạng thái', value: user.status },
      { label: 'Ngày sinh', value: user.date_of_birth },
      { label: 'Số CCCD', value: user.cccd_number },
      { label: 'CCCD mặt trước', value: user.cccd_front_image ? 'Đã upload' : 'Chưa upload' },
      { label: 'CCCD mặt sau', value: user.cccd_back_image ? 'Đã upload' : 'Chưa upload' },
    ]
    : []
)

export const getDoctorInfoFields = (doctor: DoctorManagementRowData | null): AdminInfoField[] => (
  doctor
    ? [
      { label: 'Email', value: doctor.email },
      { label: 'Số điện thoại', value: doctor.phone },
      { label: 'Mã giấy phép', value: doctor.licenseNumber },
      { label: 'CCCD', value: doctor.cccd },
      { label: 'Chuyên khoa', value: doctor.specialty },
      { label: 'Trạng thái', value: doctor.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngoại tuyến' },
      { label: 'Kinh nghiệm', value: doctor.experienceYears === undefined || doctor.experienceYears === null ? null : `${doctor.experienceYears} năm` },
      { label: 'Phí tư vấn', value: doctor.consultationFee },
      { label: 'Lịch tuần này', value: doctor.appointmentsThisWeek },
      { label: 'Ảnh đại diện', value: doctor.image },
      { label: 'Mô tả', value: doctor.description },
      { label: 'Tiểu sử chuyên môn', value: doctor.profBiography },
    ]
    : []
)

export const getPatientInfoFields = (patient: PatientManagementRowData | null): AdminInfoField[] => (
  patient
    ? [
      { label: 'Email', value: patient.email },
      { label: 'Số điện thoại', value: patient.phone },
      { label: 'Ngày sinh', value: patient.dateOfBirth },
      { label: 'Giới tính', value: patient.gender },
      { label: 'Địa chỉ', value: patient.address },
      { label: 'Số bảo hiểm', value: patient.insuranceNumber },
    ]
    : []
)
