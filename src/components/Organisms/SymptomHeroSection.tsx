import SymptomSearchBox from '../Molecules/SymptomSearchBox'
import SymptomSuggestionPill from '../Molecules/SymptomSuggestionPill'

const suggestions: string[] = []

type SymptomHeroSectionProps = {
  query: string
  onQueryChange: (query: string) => void
  onSearch: () => void
  onSuggestionSelect: (suggestion: string) => void
}

const SymptomHeroSection = ({ query, onQueryChange, onSearch, onSuggestionSelect }: SymptomHeroSectionProps) => {
  return (
    <section className="bg-gradient-to-b from-surface to-surface-container-low px-lg py-xxxl">
      <div className="mx-auto max-w-4xl space-y-xl text-center">
        <div className="space-y-md">
          <h1 className="font-display-lg text-4xl font-bold text-on-background md:text-display-lg">Kiểm tra triệu chứng</h1>
          <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            Xác định các nguyên nhân tiềm tàng cho triệu chứng của bạn và tìm chuyên gia phù hợp để điều trị.
          </p>
        </div>
        <SymptomSearchBox onChange={onQueryChange} onSubmit={onSearch} value={query} />
        {suggestions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-sm pt-md">
            <span className="self-center font-label-sm text-label-sm text-on-surface-variant">Tìm kiếm phổ biến:</span>
            {suggestions.map((suggestion) => (
              <SymptomSuggestionPill key={suggestion} label={suggestion} onSelect={onSuggestionSelect} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SymptomHeroSection
