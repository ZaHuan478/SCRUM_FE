import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AdminInfoModal from '../components/Organisms/AdminInfoModal'
import DepartmentEditModal from '../components/Organisms/DepartmentEditModal'
import type { DepartmentFormValues } from '../components/Organisms/DepartmentEditModal'
import DoctorEditModal from '../components/Organisms/DoctorEditModal'
import type { DoctorDepartmentOption, DoctorEditFormValues } from '../components/Organisms/DoctorEditModal'
import UserEditModal from '../components/Organisms/UserEditModal'
import type { UserFormValues } from '../components/Organisms/UserEditModal'
import DashboardTemplate from '../components/Templates/DashboardTemplate'
import type { AnalyticsPoint } from '../components/Organisms/AppointmentAnalyticsSection'
import type { DashboardStat } from '../components/Molecules/DashboardStatCard'
import type { DoctorManagementRowData } from '../components/Molecules/DoctorManagementRow'
import type { PatientManagementRowData } from '../components/Molecules/PatientManagementRow'
import { getAppointments } from '../services/appointment.service'
import type { AppointmentsResult } from '../services/appointment.service'
import { getAppointmentSlots } from '../services/appointmentSlot.service'
import type { AppointmentSlotsResult } from '../services/appointmentSlot.service'
import { clearAuthSession, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'
import { createDepartment, getDepartments, updateDepartment } from '../services/department.service'
import type { Department, DepartmentsResult } from '../services/department.service'
import { createDoctorAssignment, getDoctorAssignments, updateDoctorAssignment } from '../services/doctorAssignment.service'
import type { DoctorAssignmentsResult } from '../services/doctorAssignment.service'
import { getDoctors, updateDoctor, uploadDoctorImage } from '../services/doctor.service'
import type { Doctor, DoctorsResult } from '../services/doctor.service'
import { getPatients } from '../services/patient.service'
import type { PatientsResult } from '../services/patient.service'
import { changeUserStatus, createUser, deleteUser, getUsers, updateUser } from '../services/user.service'

type LoadStatus = 'loading' | 'ready' | 'error'

type DashboardState = {
  analyticsData: AnalyticsPoint[]
  analyticsStatus: LoadStatus
  departments: Department[]
  departmentStatus: LoadStatus
  doctors: DoctorManagementRowData[]
  doctorStatus: LoadStatus
  patients: PatientManagementRowData[]
  patientStatus: LoadStatus
  users: User[]
  userStatus: LoadStatus
  departmentOptions: DoctorDepartmentOption[]
  stats: DashboardStat[]
  statsStatus: LoadStatus
  totalDepartments: number
  totalDoctors: number
  totalPatients: number
}

const emptyDashboardState: DashboardState = {
  analyticsData: [],
  analyticsStatus: 'loading',
  departments: [],
  departmentStatus: 'loading',
  doctors: [],
  doctorStatus: 'loading',
  patients: [],
  patientStatus: 'loading',
  users: [],
  userStatus: 'loading',
  departmentOptions: [],
  stats: [],
  statsStatus: 'loading',
  totalDepartments: 0,
  totalDoctors: 0,
  totalPatients: 0,
}

const numberFormatter = new Intl.NumberFormat('vi-VN')
const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  weekday: 'short',
})

const getFulfilledValue = <T,>(result: PromiseSettledResult<T>) => (
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

const buildAnalyticsData = (
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

const buildDepartmentOptions = (departments?: DepartmentsResult): DoctorDepartmentOption[] => (
  (departments?.departments || []).map((department) => ({
    departmentId: department.id,
    label: department.name,
  })).filter((option) => option.label)
)

const specialtyFromDescription = (doctor: Doctor) => {
  const description = doctor.description?.trim()

  return description ? description.split(/[,.]/)[0].slice(0, 42) : undefined
}

const mapDoctors = (
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
      appointmentsThisWeek: weeklyCounts.get(doctorId) || 0,
      image: doctor.image_url,
    }
  })
}

const mapPatients = (patientsResult?: PatientsResult): PatientManagementRowData[] => (
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

const buildStats = ({
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

const loadDashboardData = async (): Promise<DashboardState> => {
  const [
    doctorsResponse,
    activeDoctorsResponse,
    patientsResponse,
    departmentsResponse,
    usersResponse,
    assignmentsResponse,
    slotsResponse,
    availableSlotsResponse,
    appointmentsResponse,
  ] = await Promise.allSettled([
    getDoctors({ limit: 100 }),
    getDoctors({ limit: 1, status: 'ACTIVE' }),
    getPatients({ limit: 100 }),
    getDepartments({ limit: 100 }),
    getUsers(),
    getDoctorAssignments({ limit: 100, status: 'ACTIVE' }),
    getAppointmentSlots({ limit: 100 }),
    getAppointmentSlots({ limit: 1, status: 'AVAILABLE' }),
    getAppointments({ limit: 100 }),
  ])

  const doctors = getFulfilledValue(doctorsResponse)
  const activeDoctors = getFulfilledValue(activeDoctorsResponse)
  const patients = getFulfilledValue(patientsResponse)
  const departments = getFulfilledValue(departmentsResponse)
  const users = getFulfilledValue(usersResponse)
  const assignments = getFulfilledValue(assignmentsResponse)
  const slots = getFulfilledValue(slotsResponse)
  const availableSlots = getFulfilledValue(availableSlotsResponse)
  const appointments = getFulfilledValue(appointmentsResponse)
  const hasStatsData = Boolean(doctors || patients || departments || users || slots || availableSlots || appointments)

  return {
    analyticsData: buildAnalyticsData(appointments, slots),
    analyticsStatus: appointments || slots ? 'ready' : 'error',
    departments: departments?.departments || [],
    departmentStatus: departments ? 'ready' : 'error',
    doctors: mapDoctors(doctors, appointments, slots, assignments),
    doctorStatus: doctors ? 'ready' : 'error',
    patients: mapPatients(patients),
    patientStatus: patients ? 'ready' : 'error',
    users: users || [],
    userStatus: users ? 'ready' : 'error',
    departmentOptions: buildDepartmentOptions(departments),
    stats: buildStats({
      activeDoctors,
      appointments,
      availableSlots,
      departments,
      doctors,
      patients,
      slots,
    }),
    statsStatus: hasStatsData ? 'ready' : 'error',
    totalDepartments: departments?.pagination.total || 0,
    totalDoctors: doctors?.pagination.total || 0,
    totalPatients: patients?.pagination.total || 0,
  }
}

const AdminDashboardContent = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboard, setDashboard] = useState<DashboardState>(emptyDashboardState)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorManagementRowData | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<PatientManagementRowData | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userEditError, setUserEditError] = useState('')
  const [isSavingUser, setIsSavingUser] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)
  const [departmentEditError, setDepartmentEditError] = useState('')
  const [isSavingDepartment, setIsSavingDepartment] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<DoctorManagementRowData | null>(null)
  const [doctorEditError, setDoctorEditError] = useState('')
  const [isSavingDoctor, setIsSavingDoctor] = useState(false)

  useEffect(() => {
    let active = true

    loadDashboardData()
      .then((data) => {
        if (!active) return
        setDashboard(data)
      })
      .catch(() => {
        if (!active) return
        setDashboard({
          ...emptyDashboardState,
          analyticsStatus: 'error',
          departmentStatus: 'error',
          doctorStatus: 'error',
          patientStatus: 'error',
          userStatus: 'error',
          statsStatus: 'error',
        })
      })

    return () => {
      active = false
    }
  }, [])

  const visibleDoctors = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return dashboard.doctors

    return dashboard.doctors.filter((doctor) => (
      `${doctor.name} ${doctor.email || ''} ${doctor.specialty || ''} ${doctor.cccd || ''}`.toLowerCase().includes(normalizedQuery)
    ))
  }, [dashboard.doctors, searchQuery])

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  const refreshDashboard = async () => {
    const nextDashboard = await loadDashboardData()
    setDashboard(nextDashboard)
  }

  const closeUserModal = () => {
    setIsUserModalOpen(false)
    setEditingUser(null)
    setUserEditError('')
  }

  const handleCreateUser = () => {
    setUserEditError('')
    setEditingUser(null)
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setUserEditError('')
    setEditingUser(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Xóa user ${user.email}?`)) return

    try {
      await deleteUser(user.id)
      await refreshDashboard()
    } catch (error) {
      setSelectedUser(user)
      setUserEditError(error instanceof Error ? error.message : 'Không thể xóa user.')
    }
  }

  const handleUserSubmit = async (payload: UserFormValues) => {
    if (!payload.email) {
      setUserEditError('Email không được để trống.')
      return
    }

    if (!editingUser && !payload.password) {
      setUserEditError('Mật khẩu là bắt buộc khi tạo user.')
      return
    }

    setUserEditError('')
    setIsSavingUser(true)

    try {
      const nextPayload = {
        full_name: payload.fullName || null,
        email: payload.email,
        phone: payload.phone || null,
        date_of_birth: payload.dateOfBirth || null,
        cccd_number: payload.cccdNumber || null,
        cccd_front_image: payload.cccdFrontImage || null,
        cccd_back_image: payload.cccdBackImage || null,
        role: payload.role,
      }

      if (editingUser) {
        await updateUser(editingUser.id, nextPayload)
        if (payload.status !== editingUser.status) {
          await changeUserStatus(editingUser.id, payload.status)
        }
      } else {
        await createUser({
          ...nextPayload,
          password: payload.password,
          status: payload.status,
        })
      }

      await refreshDashboard()
      closeUserModal()
    } catch (error) {
      setUserEditError(error instanceof Error ? error.message : 'Không thể lưu user.')
    } finally {
      setIsSavingUser(false)
    }
  }

  const closeDepartmentModal = () => {
    setIsDepartmentModalOpen(false)
    setEditingDepartment(null)
    setDepartmentEditError('')
  }

  const handleCreateDepartment = () => {
    setDepartmentEditError('')
    setEditingDepartment(null)
    setIsDepartmentModalOpen(true)
  }

  const handleEditDepartment = (department: Department) => {
    setDepartmentEditError('')
    setEditingDepartment(department)
    setIsDepartmentModalOpen(true)
  }

  const handleDepartmentEditSubmit = async (payload: DepartmentFormValues) => {
    if (!payload.name) {
      setDepartmentEditError('Tên khoa không được để trống.')
      return
    }

    setDepartmentEditError('')
    setIsSavingDepartment(true)

    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, {
          name: payload.name,
          description: payload.description,
          status: payload.status,
        })
      } else {
        await createDepartment({
          name: payload.name,
          description: payload.description,
          status: payload.status,
        })
      }

      await refreshDashboard()
      closeDepartmentModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể lưu khoa.'
      setDepartmentEditError(message)
    } finally {
      setIsSavingDepartment(false)
    }
  }

  const handleEditDoctor = (doctor: DoctorManagementRowData) => {
    setDoctorEditError('')
    setEditingDoctor(doctor)
  }

  const handleDoctorEditSubmit = async (payload: DoctorEditFormValues) => {
    if (!editingDoctor) return

    if (!editingDoctor.userId) {
      setDoctorEditError('Không tìm thấy user_id của bác sĩ.')
      return
    }

    const fullName = payload.fullName.trim()
    const licenseNumber = payload.licenseNumber.trim()
    const cccd = payload.cccd?.trim() || ''
    const departmentId = payload.departmentId

    if (!fullName) {
      setDoctorEditError('Tên bác sĩ không được để trống.')
      return
    }

    if (!licenseNumber) {
      setDoctorEditError('Mã giấy phép không được để trống.')
      return
    }

    if (cccd && !/^\d{12}$/.test(cccd)) {
      setDoctorEditError('CCCD phải gồm đúng 12 số.')
      return
    }

    setDoctorEditError('')
    setIsSavingDoctor(true)

    try {
      const uploadedDoctor = payload.imageData
        ? await uploadDoctorImage(editingDoctor.id, payload.imageData)
        : null

      await updateUser(editingDoctor.userId, { full_name: fullName })
      await updateDoctor(editingDoctor.id, {
        license_number: licenseNumber,
        cccd: cccd || null,
        experience_years: payload.experienceYears === '' || payload.experienceYears === undefined
          ? null
          : payload.experienceYears,
        consultation_fee: payload.consultationFee === '' || payload.consultationFee === undefined
          ? null
          : payload.consultationFee,
        description: payload.description?.trim() || null,
        status: payload.status,
        image_url: uploadedDoctor?.image_url || payload.imageUrl?.trim() || null,
      })

      if (departmentId && departmentId !== String(editingDoctor.departmentId || '')) {
        const existingAssignments = await getDoctorAssignments({
          doctor_id: editingDoctor.id,
          department_id: departmentId,
          limit: 1,
        })
        const existingAssignment = existingAssignments.doctor_assignments[0]
        const activatedAssignment = existingAssignment
          ? await updateDoctorAssignment(existingAssignment.id, { status: 'ACTIVE' })
          : await createDoctorAssignment({
            doctor_id: editingDoctor.id,
            department_id: departmentId,
            status: 'ACTIVE',
          })

        if (
          editingDoctor.activeAssignmentId
          && String(editingDoctor.activeAssignmentId) !== String(activatedAssignment.id)
        ) {
          await updateDoctorAssignment(editingDoctor.activeAssignmentId, { status: 'INACTIVE' })
        }
      }

      const nextDashboard = await loadDashboardData()
      setDashboard(nextDashboard)
      setEditingDoctor(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật bác sĩ.'
      setDoctorEditError(message)
    } finally {
      setIsSavingDoctor(false)
    }
  }

  const userFields = selectedUser
    ? [
      { label: 'Email', value: selectedUser.email },
      { label: 'Số điện thoại', value: selectedUser.phone },
      { label: 'Vai trò', value: selectedUser.role },
      { label: 'Trạng thái', value: selectedUser.status },
      { label: 'Ngày sinh', value: selectedUser.date_of_birth },
      { label: 'Số CCCD', value: selectedUser.cccd_number },
      { label: 'CCCD mặt trước', value: selectedUser.cccd_front_image ? 'Đã upload' : 'Chưa upload' },
      { label: 'CCCD mặt sau', value: selectedUser.cccd_back_image ? 'Đã upload' : 'Chưa upload' },
    ]
    : []

  const doctorFields = selectedDoctor
    ? [
      { label: 'Email', value: selectedDoctor.email },
      { label: 'Số điện thoại', value: selectedDoctor.phone },
      { label: 'Mã giấy phép', value: selectedDoctor.licenseNumber },
      { label: 'CCCD', value: selectedDoctor.cccd },
      { label: 'Chuyên khoa', value: selectedDoctor.specialty },
      { label: 'Trạng thái', value: selectedDoctor.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngoại tuyến' },
      { label: 'Kinh nghiệm', value: selectedDoctor.experienceYears === undefined || selectedDoctor.experienceYears === null ? null : `${selectedDoctor.experienceYears} năm` },
      { label: 'Phí tư vấn', value: selectedDoctor.consultationFee },
      { label: 'Lịch tuần này', value: selectedDoctor.appointmentsThisWeek },
      { label: 'Ảnh đại diện', value: selectedDoctor.image },
      { label: 'Mô tả', value: selectedDoctor.description },
    ]
    : []

  const patientFields = selectedPatient
    ? [
      { label: 'Email', value: selectedPatient.email },
      { label: 'Số điện thoại', value: selectedPatient.phone },
      { label: 'Ngày sinh', value: selectedPatient.dateOfBirth },
      { label: 'Giới tính', value: selectedPatient.gender },
      { label: 'Địa chỉ', value: selectedPatient.address },
      { label: 'Số bảo hiểm', value: selectedPatient.insuranceNumber },
    ]
    : []

  return (
    <>
      <DashboardTemplate
        analyticsData={dashboard.analyticsData}
        analyticsStatus={dashboard.analyticsStatus}
        departments={dashboard.departments}
        departmentStatus={dashboard.departmentStatus}
        doctors={visibleDoctors}
        doctorStatus={dashboard.doctorStatus}
        onCreateDepartment={handleCreateDepartment}
        onCreateUser={handleCreateUser}
        onDeleteUser={handleDeleteUser}
        onEditDepartment={handleEditDepartment}
        onLogout={handleLogout}
        onEditDoctor={handleEditDoctor}
        onEditUser={handleEditUser}
        onSearchQueryChange={setSearchQuery}
        onViewDoctor={setSelectedDoctor}
        onViewPatient={setSelectedPatient}
        onViewUser={setSelectedUser}
        patientStatus={dashboard.patientStatus}
        patients={dashboard.patients}
        searchQuery={searchQuery}
        stats={dashboard.stats}
        statsStatus={dashboard.statsStatus}
        totalDepartments={dashboard.totalDepartments}
        totalDoctors={dashboard.totalDoctors}
        totalPatients={dashboard.totalPatients}
        userStatus={dashboard.userStatus}
        users={dashboard.users}
      />
      <AdminInfoModal
        fields={userFields}
        onClose={() => setSelectedUser(null)}
        open={Boolean(selectedUser)}
        subtitle={selectedUser?.email || undefined}
        title={selectedUser?.full_name || 'Thông tin user'}
      />
      <AdminInfoModal
        fields={doctorFields}
        onClose={() => setSelectedDoctor(null)}
        open={Boolean(selectedDoctor)}
        subtitle={selectedDoctor?.email || undefined}
        title={selectedDoctor?.name || 'Thông tin bác sĩ'}
      />
      <AdminInfoModal
        fields={patientFields}
        onClose={() => setSelectedPatient(null)}
        open={Boolean(selectedPatient)}
        subtitle={selectedPatient?.email || undefined}
        title={selectedPatient?.name || 'Thông tin bệnh nhân'}
      />
      <DepartmentEditModal
        department={editingDepartment}
        error={departmentEditError}
        isSaving={isSavingDepartment}
        key={editingDepartment?.id || (isDepartmentModalOpen ? 'department-create-open' : 'department-create-closed')}
        onClose={closeDepartmentModal}
        onSubmit={handleDepartmentEditSubmit}
        open={isDepartmentModalOpen}
      />
      <UserEditModal
        error={userEditError}
        isSaving={isSavingUser}
        key={editingUser?.id || (isUserModalOpen ? 'user-create-open' : 'user-create-closed')}
        onClose={closeUserModal}
        onSubmit={handleUserSubmit}
        open={isUserModalOpen}
        user={editingUser}
      />
      <DoctorEditModal
        departmentOptions={dashboard.departmentOptions}
        doctor={editingDoctor}
        error={doctorEditError}
        isSaving={isSavingDoctor}
        key={editingDoctor?.id || 'doctor-edit-empty'}
        onClose={() => setEditingDoctor(null)}
        onSubmit={handleDoctorEditSubmit}
      />
    </>
  )
}

const AdminDashboardPage = () => {
  const user = getStoredUser()

  if (!user) return <Navigate replace to="/login" />
  if (user.role !== 'ADMIN') return <Navigate replace to="/" />

  return <AdminDashboardContent />
}

export default AdminDashboardPage
