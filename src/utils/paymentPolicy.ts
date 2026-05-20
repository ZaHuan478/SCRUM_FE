import type { AppointmentSlot } from '../services/appointmentSlot.service'

export type PaymentPolicy = {
  depositRate: number
  depositPercent: 50 | 100
  isAdvanceBooking: boolean
  totalAmount: number
  payableAmount: number
}

const startOfLocalDate = (date: Date) => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate()
)

const getCalendarDayDiff = (fromDate: Date, toDate: Date) => {
  const from = startOfLocalDate(fromDate)
  const to = startOfLocalDate(toDate)

  return Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000))
}

export const paymentRuleNote = 'Quy tắc thanh toán: đặt lịch trước ít nhất 3 ngày chỉ cần thanh toán trước 50%; đặt lịch dưới 3 ngày, bao gồm đặt trong ngày, cần thanh toán 100%. Nếu hủy lịch trước ngày khám, bạn sẽ được hoàn tiền. Nếu hủy trong ngày khám hoặc khi còn 24 giờ nữa tới giờ khám, khoản thanh toán sẽ không được hoàn lại.'

export const getPaymentPolicyForSlot = (
  slot?: AppointmentSlot | null,
  now: Date = new Date()
): PaymentPolicy => {
  const totalAmount = Number(slot?.doctor_assignment?.doctor?.consultation_fee || 0)
  const startTime = slot?.start_time ? new Date(slot.start_time) : null
  const isAdvanceBooking = Boolean(startTime && getCalendarDayDiff(now, startTime) >= 3)
  const depositRate = isAdvanceBooking ? 0.5 : 1

  return {
    depositRate,
    depositPercent: isAdvanceBooking ? 50 : 100,
    isAdvanceBooking,
    totalAmount,
    payableAmount: Math.round(totalAmount * depositRate),
  }
}

export const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  currency: 'VND',
  maximumFractionDigits: 0,
  style: 'currency',
})
