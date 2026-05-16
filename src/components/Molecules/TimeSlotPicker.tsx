import Card from '../Atoms/Card'
import type { TimeSlot } from '../../data/appointment'

type TimeSlotPickerProps = {
  slots: TimeSlot[]
  selectedSlotId: string
  onSelect: (slotId: string) => void
}

const TimeSlotPicker = ({ slots, selectedSlotId, onSelect }: TimeSlotPickerProps) => {
  return (
    <Card className="p-lg">
      <h3 className="mb-lg font-headline-sm text-headline-sm text-on-surface">Giờ khám hiện có</h3>
      <div className="grid grid-cols-2 gap-sm">
        {slots.map((slot) => {
          const selected = slot.id === selectedSlotId

          return (
            <button
              className={`rounded-lg px-md py-sm font-label-md text-label-md transition-all ${
                selected
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'border border-outline-variant text-on-surface hover:border-primary hover:text-primary'
              }`}
              key={slot.id}
              onClick={() => onSelect(slot.id)}
              type="button"
            >
              {slot.label}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default TimeSlotPicker
