import {
  Accessibility,
  Activity,
  Apple,
  Baby,
  Bone,
  Brain,
  Droplets,
  Dumbbell,
  Ear,
  Eye,
  HeartHandshake,
  HeartPulse,
  Leaf,
  Pill,
  ScanSearch,
  Scissors,
  ShieldAlert,
  ShieldPlus,
  Siren,
  SmilePlus,
  Sparkles,
  Stethoscope,
  TestTube,
  ToyBrick,
  Wind,
  type LucideIcon,
} from 'lucide-react'

export type DepartmentIconMeta = {
  Icon: LucideIcon
  backgroundClassName: string
  colorClassName: string
  hoverClassName: string
}

const fallbackDepartmentIcon: DepartmentIconMeta = {
  Icon: Stethoscope,
  backgroundClassName: 'bg-blue-50',
  colorClassName: 'text-blue-600',
  hoverClassName: 'group-hover:bg-blue-100 group-hover:text-blue-700',
}

export const departmentIconMap: Record<string, DepartmentIconMeta> = {
  'Khoa Tim mạch': {
    Icon: HeartPulse,
    backgroundClassName: 'bg-red-50',
    colorClassName: 'text-red-600',
    hoverClassName: 'group-hover:bg-red-100 group-hover:text-red-700',
  },
  'Khoa Sản phụ khoa': {
    Icon: Baby,
    backgroundClassName: 'bg-pink-50',
    colorClassName: 'text-pink-600',
    hoverClassName: 'group-hover:bg-pink-100 group-hover:text-pink-700',
  },
  'Khoa Chấn Thương Chỉnh Hình': {
    Icon: Bone,
    backgroundClassName: 'bg-orange-50',
    colorClassName: 'text-orange-600',
    hoverClassName: 'group-hover:bg-orange-100 group-hover:text-orange-700',
  },
  'Khoa Nội tổng quát': {
    Icon: Stethoscope,
    backgroundClassName: 'bg-blue-50',
    colorClassName: 'text-blue-600',
    hoverClassName: 'group-hover:bg-blue-100 group-hover:text-blue-700',
  },
  'Khoa Ngoại tổng quát': {
    Icon: Scissors,
    backgroundClassName: 'bg-red-50',
    colorClassName: 'text-red-600',
    hoverClassName: 'group-hover:bg-red-100 group-hover:text-red-700',
  },
  'Khoa Nhi': {
    Icon: ToyBrick,
    backgroundClassName: 'bg-yellow-50',
    colorClassName: 'text-yellow-700',
    hoverClassName: 'group-hover:bg-yellow-100 group-hover:text-yellow-800',
  },
  'Khoa Tai Mũi Họng': {
    Icon: Ear,
    backgroundClassName: 'bg-purple-50',
    colorClassName: 'text-purple-600',
    hoverClassName: 'group-hover:bg-purple-100 group-hover:text-purple-700',
  },
  'Khoa Da liễu': {
    Icon: Sparkles,
    backgroundClassName: 'bg-pink-50',
    colorClassName: 'text-pink-600',
    hoverClassName: 'group-hover:bg-pink-100 group-hover:text-pink-700',
  },
  'Khoa Thần kinh': {
    Icon: Brain,
    backgroundClassName: 'bg-indigo-50',
    colorClassName: 'text-indigo-600',
    hoverClassName: 'group-hover:bg-indigo-100 group-hover:text-indigo-700',
  },
  'Khoa Cơ xương khớp': {
    Icon: Accessibility,
    backgroundClassName: 'bg-green-50',
    colorClassName: 'text-green-600',
    hoverClassName: 'group-hover:bg-green-100 group-hover:text-green-700',
  },
  'Khoa Hô hấp': {
    Icon: Wind,
    backgroundClassName: 'bg-cyan-50',
    colorClassName: 'text-cyan-600',
    hoverClassName: 'group-hover:bg-cyan-100 group-hover:text-cyan-700',
  },
  'Khoa Tiêu hóa': {
    Icon: Pill,
    backgroundClassName: 'bg-amber-50',
    colorClassName: 'text-amber-600',
    hoverClassName: 'group-hover:bg-amber-100 group-hover:text-amber-700',
  },
  'Khoa Nội tiết': {
    Icon: Activity,
    backgroundClassName: 'bg-lime-50',
    colorClassName: 'text-lime-700',
    hoverClassName: 'group-hover:bg-lime-100 group-hover:text-lime-800',
  },
  'Khoa Mắt': {
    Icon: Eye,
    backgroundClassName: 'bg-blue-50',
    colorClassName: 'text-blue-600',
    hoverClassName: 'group-hover:bg-blue-100 group-hover:text-blue-700',
  },
  'Khoa Răng Hàm Mặt': {
    Icon: SmilePlus,
    backgroundClassName: 'bg-zinc-100',
    colorClassName: 'text-zinc-700',
    hoverClassName: 'group-hover:bg-zinc-200 group-hover:text-zinc-900',
  },
  'Khoa Thận - Tiết niệu': {
    Icon: Droplets,
    backgroundClassName: 'bg-sky-50',
    colorClassName: 'text-sky-600',
    hoverClassName: 'group-hover:bg-sky-100 group-hover:text-sky-700',
  },
  'Khoa Ung bướu': {
    Icon: ShieldAlert,
    backgroundClassName: 'bg-rose-50',
    colorClassName: 'text-rose-600',
    hoverClassName: 'group-hover:bg-rose-100 group-hover:text-rose-700',
  },
  'Khoa Cấp cứu': {
    Icon: Siren,
    backgroundClassName: 'bg-red-50',
    colorClassName: 'text-red-600',
    hoverClassName: 'group-hover:bg-red-100 group-hover:text-red-700',
  },
  'Khoa Truyền nhiễm': {
    Icon: ShieldPlus,
    backgroundClassName: 'bg-orange-50',
    colorClassName: 'text-orange-600',
    hoverClassName: 'group-hover:bg-orange-100 group-hover:text-orange-700',
  },
  'Khoa Phục hồi chức năng': {
    Icon: Dumbbell,
    backgroundClassName: 'bg-emerald-50',
    colorClassName: 'text-emerald-600',
    hoverClassName: 'group-hover:bg-emerald-100 group-hover:text-emerald-700',
  },
  'Khoa Tâm thần': {
    Icon: HeartHandshake,
    backgroundClassName: 'bg-violet-50',
    colorClassName: 'text-violet-600',
    hoverClassName: 'group-hover:bg-violet-100 group-hover:text-violet-700',
  },
  'Khoa Dinh dưỡng': {
    Icon: Apple,
    backgroundClassName: 'bg-green-50',
    colorClassName: 'text-green-600',
    hoverClassName: 'group-hover:bg-green-100 group-hover:text-green-700',
  },
  'Khoa Y học cổ truyền': {
    Icon: Leaf,
    backgroundClassName: 'bg-emerald-50',
    colorClassName: 'text-emerald-600',
    hoverClassName: 'group-hover:bg-emerald-100 group-hover:text-emerald-700',
  },
  'Khoa Chẩn đoán hình ảnh': {
    Icon: ScanSearch,
    backgroundClassName: 'bg-cyan-50',
    colorClassName: 'text-cyan-600',
    hoverClassName: 'group-hover:bg-cyan-100 group-hover:text-cyan-700',
  },
  'Khoa Xét nghiệm': {
    Icon: TestTube,
    backgroundClassName: 'bg-blue-50',
    colorClassName: 'text-blue-600',
    hoverClassName: 'group-hover:bg-blue-100 group-hover:text-blue-700',
  },
}

const normalizeDepartmentName = (name: string) => (
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
)

const normalizedDepartmentIconMap = Object.entries(departmentIconMap).reduce<Record<string, DepartmentIconMeta>>(
  (icons, [name, meta]) => {
    icons[normalizeDepartmentName(name)] = meta
    return icons
  },
  {}
)

export const getDepartmentIconMeta = (departmentName: string): DepartmentIconMeta => (
  departmentIconMap[departmentName] || normalizedDepartmentIconMap[normalizeDepartmentName(departmentName)] || fallbackDepartmentIcon
)
