import DepartmentCard from '../Molecules/DepartmentCard'

const departments = [
  { icon: 'favorite', label: 'Tim mạch', tone: 'primary' },
  { icon: 'psychology', label: 'Thần kinh', tone: 'secondary' },
  { icon: 'child_care', label: 'Nhi khoa', tone: 'tertiary' },
  { icon: 'orthopedics', label: 'Chỉnh hình', tone: 'primary' },
  { icon: 'visibility', label: 'Nhãn khoa', tone: 'secondary' },
  { icon: 'dentistry', label: 'Nha khoa', tone: 'tertiary' },
  { icon: 'dermatology', label: 'Da liễu', tone: 'primary' },
  { icon: 'add_circle', label: 'Xem thêm', tone: 'neutral' },
] as const

const DepartmentsSection = () => {
  return (
    <section className="bg-surface-container-low px-lg py-xxxl md:px-xxl" id="departments">
      <div className="mx-auto max-w-7xl">
        <div className="mb-xxl text-center">
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Khoa chuyên môn</h2>
          <p className="mx-auto max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Tiếp cận đầy đủ các dịch vụ chăm sóc sức khỏe chuyên sâu với tiêu chuẩn y khoa chính xác.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-md md:grid-cols-4">
          {departments.map((department) => (
            <DepartmentCard
              icon={department.icon}
              key={department.label}
              label={department.label}
              tone={department.tone}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default DepartmentsSection
