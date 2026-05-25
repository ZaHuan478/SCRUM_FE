import SymptomSearchBox from '../../Molecules/SymptomChecker/SymptomSearchBox'
import SymptomSuggestionPill from '../../Molecules/SymptomChecker/SymptomSuggestionPill'

const popularSuggestions = ['Đau ngực', 'Khó thở', 'Đau đầu kéo dài', 'Đau bụng', 'Mất ngủ', 'Đau lưng']

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
    <section className="bg-surface px-lg py-[80px]">
      <div className="mx-auto max-w-4xl space-y-xl text-center">
        <div className="space-y-md">
          <h1 className="font-display-lg text-[44px] font-medium leading-none text-on-background md:text-[56px]">Kiểm tra triệu chứng</h1>
          <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            Xác định các nguyên nhân tiềm tàng cho triệu chứng của bạn và tìm chuyên gia phù hợp để điều trị.
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
            <span className="self-center font-label-sm text-label-sm text-on-surface-variant">Tìm kiếm phổ biến:</span>
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
