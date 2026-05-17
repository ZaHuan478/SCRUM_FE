import Button from '../Atoms/Button'

type SymptomSuggestionPillProps = {
  label: string
  onSelect: (label: string) => void
}

const SymptomSuggestionPill = ({ label, onSelect }: SymptomSuggestionPillProps) => {
  return (
    <Button
      fullWidth={false}
      variant="ghost"
      className="rounded-full border border-secondary-fixed bg-secondary-fixed/30 px-md py-xs font-label-sm text-label-sm text-on-secondary-fixed-variant transition-colors hover:bg-secondary-fixed/50"
      onClick={() => onSelect(label)}
      type="button"
    >
      {label}
    </Button>
  )
}

export default SymptomSuggestionPill
