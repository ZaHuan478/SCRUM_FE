import SymptomSearchBox from '../../Molecules/SymptomChecker/SymptomSearchBox'
import SymptomSuggestionPill from '../../Molecules/SymptomChecker/SymptomSuggestionPill'

const popularSuggestions = ['Dau nguc', 'Kho tho', 'Dau dau keo dai', 'Dau bung', 'Mat ngu', 'Dau lung']

type SymptomHeroSectionProps = {
  searchSuggestions: string[]
  query: string
  onQueryChange: (query: string) => void
  onSearch: () => void
  onSuggestionSelect: (suggestion: string) => void
}

const SymptomHeroSection = ({
  searchSuggestions,
  query,
  onQueryChange,
  onSearch,
  onSuggestionSelect,
}: SymptomHeroSectionProps) => {
  return (
    <section className="relative overflow-hidden px-lg pb-[64px] pt-[132px] md:px-xxl md:pb-[88px] md:pt-[152px]">
      <div className="mx-auto max-w-4xl space-y-xl text-center">
        <div className="space-y-md">
          <span className="inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.32em] text-on-surface-variant">
            <span className="h-1 w-10 rounded-full bg-primary" />
            AI health assistant
          </span>
          <h1 className="font-display-lg text-[42px] font-semibold uppercase leading-[0.92] text-on-background sm:text-[56px] md:text-[72px]">
            Kiểm tra triệu chứng
          </h1>
          <p className="mx-auto max-w-2xl font-body-lg text-body-lg leading-8 text-on-surface-variant">
            Xác địng các nguyên nhân tiềm ẩn cho triệu chứng của bạn và tìm chuyên gia phù hợp để điều trị.
          </p>
        </div>
        <SymptomSearchBox
          onChange={onQueryChange}
          onSubmit={onSearch}
          onSuggestionSelect={onSuggestionSelect}
          suggestions={searchSuggestions}
          value={query}
        />
        {popularSuggestions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-sm pt-md">
            <span className="self-center font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
             Tìm kiểm phổ biến: 
            </span>
            {popularSuggestions.map((suggestion) => (
              <SymptomSuggestionPill key={suggestion} label={suggestion} onSelect={onSuggestionSelect} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SymptomHeroSection
