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

const CLOUDINARY_SCAN_TRANSFORMATION = 'c_limit,w_1280,q_auto:good'
const isDev = import.meta.env.DEV

const formatDebugValue = (value: unknown) => {
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

const getNestedValue = (value: unknown, keys: string[]): unknown => {
  if (!value || typeof value !== 'object') return undefined

  return keys.reduce<unknown>((current, key) => (
    current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
  ), value)
}

const getErrorMessage = (value: unknown) => {
  if (typeof value === 'string') return value

  const message = getNestedValue(value, ['message'])
    || getNestedValue(value, ['error'])
    || getNestedValue(value, ['data', 'message'])
    || getNestedValue(value, ['result', 'message'])

  return typeof message === 'string' && message.trim()
    ? message
    : 'Không thể quét CCCD.'
}

const buildScanImageUrl = (imageUrl: string) => {
  const trimmedUrl = imageUrl.trim()

  try {
    const url = new URL(trimmedUrl)
    const uploadSegment = '/upload/'

    if (!url.hostname.includes('cloudinary.com') || !url.pathname.includes(uploadSegment)) {
      return trimmedUrl
    }

    if (url.pathname.includes(`${uploadSegment}${CLOUDINARY_SCAN_TRANSFORMATION}/`)) {
      return url.toString()
    }

    url.pathname = url.pathname.replace(uploadSegment, `${uploadSegment}${CLOUDINARY_SCAN_TRANSFORMATION}/`)
    return url.toString()
  } catch {
    return trimmedUrl
  }
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

  const frontUrl = buildScanImageUrl(frontImage)
  const backUrl = buildScanImageUrl(backImage)
  const payload = {
    cccd_front_image: frontUrl,
    cccd_back_image: backUrl,
    cccd_front_image_url: frontUrl,
    cccd_back_image_url: backUrl,
    front_image: frontUrl,
    back_image: backUrl,
    front_image_url: frontUrl,
    back_image_url: backUrl,
    frontImage: frontUrl,
    backImage: backUrl,
    frontImageUrl: frontUrl,
    backImageUrl: backUrl,
  }

  if (isDev) {
    console.info(`[CCCD Scan] Request URL: ${CCCD_SCAN_URL}`)
    console.info(`[CCCD Scan] Request payload:\n${formatDebugValue(payload)}`)
  }

  const response = await fetch(CCCD_SCAN_URL, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const contentType = response.headers.get('content-type') || ''
  const raw = contentType.includes('application/json') ? await response.json() : await response.text()

  if (isDev) {
    console.info(`[CCCD Scan] Response status: ${response.status} ${response.statusText || ''}`)
    console.info(`[CCCD Scan] Response content-type: ${contentType || '(empty)'}`)
    console.info(`[CCCD Scan] Response body:\n${formatDebugValue(raw)}`)
  }

  if (!response.ok) {
    const detail = formatDebugValue(raw)
    console.error(`[CCCD Scan] Request failed: ${response.status} ${response.statusText || ''}\n${detail}`)
    throw new Error(`${getErrorMessage(raw)} (HTTP ${response.status})`)
  }

  if (getNestedValue(raw, ['code']) === 0 && getNestedValue(raw, ['message'])) {
    console.error(`[CCCD Scan] Workflow returned an error payload:\n${formatDebugValue(raw)}`)
    throw new Error(getErrorMessage(raw))
  }

  return {
    cccdNumber: findCccdNumber(raw),
    dateOfBirth: findDateOfBirth(raw),
    fullName: findFullName(raw),
    gender: findGender(raw),
    raw,
  }
}
