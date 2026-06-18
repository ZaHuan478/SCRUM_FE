import React from 'react'
import * as LucideIcons from 'lucide-react'

type IconProps = {
  name: string
  className?: string
}

type LucideComponent = React.ComponentType<{
  'aria-hidden'?: boolean
  className?: string
  strokeWidth?: number
}>

const lucideIconMap: Record<string, string> = {
  account_circle: 'CircleUserRound',
  add: 'Plus',
  admin_panel_settings: 'ShieldCheck',
  arrow_back: 'ArrowLeft',
  arrow_forward: 'ArrowRight',
  calendar_month: 'CalendarDays',
  check: 'Check',
  chevron_left: 'ChevronLeft',
  chevron_right: 'ChevronRight',
  clinical_notes: 'ClipboardList',
  close: 'X',
  dashboard: 'LayoutDashboard',
  delete: 'Trash2',
  description: 'FileText',
  diagnosis: 'Activity',
  edit: 'Pencil',
  event_available: 'CalendarCheck',
  event_note: 'CalendarClock',
  expand_more: 'ChevronDown',
  filter_list: 'ListFilter',
  groups: 'UsersRound',
  home: 'House',
  info: 'Info',
  keyboard_arrow_down: 'ChevronDown',
  logout: 'LogOut',
  manage_accounts: 'UserCog',
  medical_information: 'Stethoscope',
  medical_services: 'BriefcaseMedical',
  more_vert: 'MoreVertical',
  person_add: 'UserPlus',
  personal_injury: 'ContactRound',
  receipt_long: 'ScrollText',
  search: 'Search',
  search_off: 'SearchX',
  settings: 'Settings',
  star: 'Star',
  verified: 'BadgeCheck',
  visibility: 'Eye',
}

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  const iconExportName = lucideIconMap[name]
  const LucideIcon = iconExportName
    ? (LucideIcons as unknown as Record<string, LucideComponent | undefined>)[iconExportName]
    : undefined

  if (LucideIcon) {
    return (
      <LucideIcon
        aria-hidden
        className={`inline-block h-[1.15em] w-[1.15em] shrink-0 ${className}`}
        strokeWidth={2}
      />
    )
  }

  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden>
      {name}
    </span>
  )
}

export default Icon
