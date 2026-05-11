import { Input } from '../../../components/ui'

export default function SlotTimePicker({ date, startTime, endTime, onChange }) {
  const today = new Date().toISOString().split('T')[0]

  let duration = null
  if (date && startTime && endTime) {
    const diff = (new Date(`${date}T${endTime}`) - new Date(`${date}T${startTime}`)) / 60000
    if (diff > 0) {
      const h = Math.floor(diff / 60), m = diff % 60
      duration = `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m` : ''}`.trim()
    } else {
      duration = 'invalid'
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Date" type="date" min={today}
          value={date}
          onChange={e => onChange('date', e.target.value)}
          className="[color-scheme:dark]"
        />
        <Input
          label="Start Time" type="time"
          value={startTime}
          onChange={e => onChange('startTime', e.target.value)}
          className="[color-scheme:dark]"
        />
        <Input
          label="End Time" type="time"
          value={endTime}
          onChange={e => onChange('endTime', e.target.value)}
          className="[color-scheme:dark]"
        />
      </div>
      {duration && (
        <p className="text-caption text-text-tertiary">
          Duration:{' '}
          {duration === 'invalid'
            ? <span className="text-danger font-medium">End time must be after start time</span>
            : <span className="text-text-secondary font-medium">{duration}</span>}
        </p>
      )}
    </div>
  )
}
