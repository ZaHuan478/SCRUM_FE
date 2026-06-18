import Button from '../../Atoms/Button'

type SymptomSuggestionPillProps = {
  label: string
  onSelect: (label: string) => void
}

const SymptomSuggestionPill = ({ label, onSelect }: SymptomSuggestionPillProps) => {
  return (
    <Button
      fullWidth={false}
      variant="ghost"
      className="rounded-full border border-outline-variant/45 bg-surface/76 px-md py-xs font-label-sm text-label-sm text-on-surface-variant shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary-fixed/35 hover:text-primary"
      onClick={() => onSelect(label)}
      type="button"
    >
      {label}
    </Button>
  )
}

export default SymptomSuggestionPill
