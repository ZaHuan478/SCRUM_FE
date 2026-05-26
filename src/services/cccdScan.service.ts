const CCCD_SCAN_URL = import.meta.env.VITE_CCCD_FRONTEND_URL || ''

type CccdScanPayload = {
  frontImage: string
  backImage: string
}

type CccdScanResult = {
  cccdNumber?: string
  dateOfBirth?: string
  fullName?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  raw: unknown
}

const getNestedValue = (value: unknown, keys: string[]): unknown => {
  if (!value || typeof value !== 'object') return undefined

  return keys.reduce<unknown>((current, key) => (
    current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
  ), value)
}

const findCccdNumber = (value: unknown): string | undefined => {
  const candidates = [
    getNestedValue(value, ['cccd_number']),
    getNestedValue(value, ['cccdNumber']),
    getNestedValue(value, ['id_number']),
    getNestedValue(value, ['idNumber']),
    getNestedValue(value, ['number']),
    getNestedValue(value, ['data', 'cccd_number']),
    getNestedValue(value, ['data', 'cccdNumber']),
    getNestedValue(value, ['data', 'id_number']),
    getNestedValue(value, ['data', 'idNumber']),
    getNestedValue(value, ['result', 'cccd_number']),
    getNestedValue(value, ['result', 'cccdNumber']),
    getNestedValue(value, ['result', 'id_number']),
    getNestedValue(value, ['result', 'idNumber']),
  ]

  const matchedCandidate = candidates
    .map((candidate) => String(candidate || '').replace(/\D/g, ''))
    .find((candidate) => /^\d{12}$/.test(candidate))

  if (matchedCandidate) return matchedCandidate

  const rawText = JSON.stringify(value)
  return rawText.match(/\b\d{12}\b/)?.[0]
}

const normalizeDateOfBirth = (value: unknown): string | undefined => {
  const rawValue = String(value || '').trim()
  if (!rawValue) return undefined

  const isoMatch = rawValue.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/)
  const vnMatch = rawValue.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/)
  const compactMatch = rawValue.match(/\b(\d{2})(\d{2})(\d{4})\b/)
  const match = isoMatch || vnMatch || compactMatch
  if (!match) return undefined

  const [, first, second, third] = match
  const year = isoMatch ? Number(first) : Number(third)
  const month = Number(second)
  const day = isoMatch ? Number(third) : Number(first)
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
  ) {
    return undefined
  }

  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const findDateOfBirth = (value: unknown): string | undefined => {
  const candidates = [
    getNestedValue(value, ['date_of_birth']),
    getNestedValue(value, ['dateOfBirth']),
    getNestedValue(value, ['dob']),
    getNestedValue(value, ['birth_date']),
    getNestedValue(value, ['birthDate']),
    getNestedValue(value, ['birthday']),
    getNestedValue(value, ['ngay_sinh']),
    getNestedValue(value, ['data', 'date_of_birth']),
    getNestedValue(value, ['data', 'dateOfBirth']),
    getNestedValue(value, ['data', 'dob']),
    getNestedValue(value, ['data', 'birth_date']),
    getNestedValue(value, ['data', 'birthday']),
    getNestedValue(value, ['data', 'ngay_sinh']),
    getNestedValue(value, ['result', 'date_of_birth']),
    getNestedValue(value, ['result', 'dateOfBirth']),
    getNestedValue(value, ['result', 'dob']),
    getNestedValue(value, ['result', 'birth_date']),
    getNestedValue(value, ['result', 'birthday']),
    getNestedValue(value, ['result', 'ngay_sinh']),
  ]

  const matchedCandidate = candidates
    .map(normalizeDateOfBirth)
    .find(Boolean)

  if (matchedCandidate) return matchedCandidate

  return normalizeDateOfBirth(JSON.stringify(value))
}

const normalizeGender = (value: unknown): CccdScanResult['gender'] | undefined => {
  const rawValue = String(value || '').trim().toLowerCase()
  if (!rawValue) return undefined

  if (['male', 'm', 'nam'].includes(rawValue)) return 'MALE'
  if (['female', 'f', 'nu', 'nữ'].includes(rawValue)) return 'FEMALE'
  if (['other', 'o', 'khac', 'khác'].includes(rawValue)) return 'OTHER'

  return undefined
}

const findGender = (value: unknown): CccdScanResult['gender'] | undefined => {
  const candidates = [
    getNestedValue(value, ['gender']),
    getNestedValue(value, ['sex']),
    getNestedValue(value, ['gioi_tinh']),
    getNestedValue(value, ['data', 'gender']),
    getNestedValue(value, ['data', 'sex']),
    getNestedValue(value, ['data', 'gioi_tinh']),
    getNestedValue(value, ['result', 'gender']),
    getNestedValue(value, ['result', 'sex']),
    getNestedValue(value, ['result', 'gioi_tinh']),
  ]

  return candidates.map(normalizeGender).find(Boolean)
}

const findFullName = (value: unknown): string | undefined => {
  const candidates = [
    getNestedValue(value, ['full_name']),
    getNestedValue(value, ['fullName']),
    getNestedValue(value, ['name']),
    getNestedValue(value, ['ho_ten']),
    getNestedValue(value, ['data', 'full_name']),
    getNestedValue(value, ['data', 'fullName']),
    getNestedValue(value, ['data', 'name']),
    getNestedValue(value, ['data', 'ho_ten']),
    getNestedValue(value, ['result', 'full_name']),
    getNestedValue(value, ['result', 'fullName']),
    getNestedValue(value, ['result', 'name']),
    getNestedValue(value, ['result', 'ho_ten']),
  ]

  return candidates
    .map((candidate) => String(candidate || '').trim())
    .find((candidate) => candidate.length > 1 && !/^\d+$/.test(candidate))
}

export const scanCccdImages = async ({ frontImage, backImage }: CccdScanPayload): Promise<CccdScanResult> => {
  if (!CCCD_SCAN_URL) {
    throw new Error('Chưa cấu hình VITE_CCCD_FRONTEND_URL.')
  }

  const response = await fetch(CCCD_SCAN_URL, {
    body: JSON.stringify({
      cccd_back_image: backImage,
      cccd_front_image: frontImage,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const contentType = response.headers.get('content-type') || ''
  const raw = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(typeof raw === 'string' ? raw : 'Không thể quét CCCD.')
  }

  return {
    cccdNumber: findCccdNumber(raw),
    dateOfBirth: findDateOfBirth(raw),
    fullName: findFullName(raw),
    gender: findGender(raw),
    raw,
  }
}
