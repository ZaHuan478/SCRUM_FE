import Icon from '../../Atoms/Icon'
import type { Symptom } from '../../../services/symptom.service'

type SymptomAnalysisPanelProps = {
  analyzed: boolean
  symptoms: Symptom[]
}

const normalizeVietnameseText = (value: string) => (
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
)

const conditionRules: Array<{ keywords: string[]; conditions: string[] }> = [
  {
    keywords: ['dau nguc', 'tuc nguc', 'nong nguc'],
    conditions: ['đau thắt ngực hoặc bệnh mạch vành', 'trào ngược dạ dày thực quản', 'viêm phổi hoặc viêm màng phổi', 'căng cơ thành ngực'],
  },
  {
    keywords: ['kho tho', 'hut hoi', 'tho gap'],
    conditions: ['hen phế quản', 'viêm phổi hoặc nhiễm trùng hô hấp', 'suy tim', 'rối loạn lo âu hoặc cơn hoảng sợ'],
  },
  {
    keywords: ['dau dau', 'nhuc dau', 'dau nua dau'],
    conditions: ['migraine', 'viêm xoang', 'tăng huyết áp', 'căng thẳng hoặc thiếu ngủ'],
  },
  {
    keywords: ['dau bung', 'dau da day', 'dau thuong vi'],
    conditions: ['viêm dạ dày', 'rối loạn tiêu hóa', 'viêm ruột thừa', 'sỏi mật hoặc bệnh lý gan mật'],
  },
  {
    keywords: ['mat ngu', 'kho ngu', 'ngu khong sau'],
    conditions: ['rối loạn giấc ngủ', 'căng thẳng kéo dài', 'rối loạn lo âu', 'trầm cảm'],
  },
  {
    keywords: ['ho', 'ho khan', 'ho dom'],
    conditions: ['cảm lạnh hoặc cúm', 'viêm phế quản', 'viêm phổi', 'dị ứng hoặc hen phế quản'],
  },
  {
    keywords: ['sot', 'nong lanh', 'ot lanh'],
    conditions: ['nhiễm virus', 'nhiễm khuẩn', 'viêm họng hoặc viêm phổi', 'nhiễm trùng đường tiết niệu'],
  },
  {
    keywords: ['chong mat', 'choang vang', 'mat thang bang'],
    conditions: ['rối loạn tiền đình', 'hạ huyết áp', 'thiếu máu', 'hạ đường huyết'],
  },
  {
    keywords: ['buon non', 'non', 'oi'],
    conditions: ['rối loạn tiêu hóa', 'ngộ độc thực phẩm', 'viêm dạ dày', 'thai kỳ hoặc tác dụng phụ của thuốc'],
  },
  {
    keywords: ['dau lung', 'dau cot song', 'moi lung'],
    conditions: ['căng cơ hoặc sai tư thế', 'thoái hóa cột sống', 'thoát vị đĩa đệm', 'sỏi thận hoặc nhiễm trùng tiết niệu'],
  },
  {
    keywords: ['dau khop', 'sung khop', 'cung khop'],
    conditions: ['viêm khớp', 'thoái hóa khớp', 'gout', 'chấn thương hoặc quá tải vận động'],
  },
  {
    keywords: ['phat ban', 'noi man', 'ngua', 'me day'],
    conditions: ['dị ứng', 'viêm da cơ địa', 'mề đay', 'nhiễm trùng da'],
  },
  {
    keywords: ['tieu buot', 'tieu rat', 'tieu nhieu', 'nuoc tieu'],
    conditions: ['nhiễm trùng đường tiết niệu', 'sỏi tiết niệu', 'viêm bàng quang', 'rối loạn chuyển hóa như đái tháo đường'],
  },
  {
    keywords: ['tieu chay', 'di ngoai long'],
    conditions: ['nhiễm khuẩn hoặc virus đường ruột', 'ngộ độc thực phẩm', 'hội chứng ruột kích thích', 'không dung nạp thức ăn'],
  },
  {
    keywords: ['tao bon', 'kho di ngoai'],
    conditions: ['thiếu chất xơ hoặc thiếu nước', 'hội chứng ruột kích thích', 'suy giáp', 'tác dụng phụ của thuốc'],
  },
  {
    keywords: ['mo mat', 'nhin mo', 'dau mat', 'do mat'],
    conditions: ['tật khúc xạ', 'viêm kết mạc', 'khô mắt', 'tăng nhãn áp hoặc bệnh lý võng mạc'],
  },
  {
    keywords: ['hoi hop', 'tim dap nhanh', 'danh trong nguc'],
    conditions: ['rối loạn nhịp tim', 'cường giáp', 'thiếu máu', 'lo âu hoặc dùng chất kích thích'],
  },
]

const bodyPartConditionFallback: Record<string, string[]> = {
  'ho hap': ['nhiễm trùng hô hấp', 'hen phế quản', 'viêm phế quản'],
  tim: ['bệnh mạch vành', 'rối loạn nhịp tim', 'tăng huyết áp'],
  'tieu hoa': ['rối loạn tiêu hóa', 'viêm dạ dày', 'hội chứng ruột kích thích'],
  'than kinh': ['migraine', 'rối loạn tiền đình', 'căng thẳng kéo dài'],
  'co xuong khop': ['căng cơ', 'thoái hóa khớp', 'chấn thương vận động'],
  da: ['dị ứng', 'viêm da', 'nhiễm trùng da'],
  'tiet nieu': ['nhiễm trùng đường tiết niệu', 'sỏi tiết niệu', 'viêm bàng quang'],
}

const inferCommonConditions = (symptom: Symptom) => {
  const normalizedName = normalizeVietnameseText(symptom.name)
  const matchedRule = conditionRules.find((rule) => (
    rule.keywords.some((keyword) => normalizedName.includes(keyword))
  ))

  if (matchedRule) return matchedRule.conditions

  const normalizedBodyPart = normalizeVietnameseText(symptom.body_part || '')
  const fallbackKey = Object.keys(bodyPartConditionFallback).find((key) => normalizedBodyPart.includes(key))

  return fallbackKey
    ? bodyPartConditionFallback[fallbackKey]
    : ['các rối loạn chức năng tạm thời', 'tình trạng viêm hoặc nhiễm trùng', 'bệnh lý cần bác sĩ thăm khám để xác định nguyên nhân']
}

const buildFallbackDescription = (symptom: Symptom) => {
  const bodyPart = symptom.body_part ? ` liên quan đến ${symptom.body_part.toLowerCase()}` : ''

  return `${symptom.name} là triệu chứng${bodyPart} cần được theo dõi theo thời gian xuất hiện, mức độ nặng nhẹ và các dấu hiệu đi kèm. Nếu triệu chứng kéo dài, tăng dần hoặc ảnh hưởng sinh hoạt, bạn nên đặt lịch khám để bác sĩ đánh giá nguyên nhân và hướng xử trí phù hợp.`
}

const SymptomAnalysisPanel = ({ analyzed, symptoms }: SymptomAnalysisPanelProps) => {
  if (!analyzed) return null

  return (
    <section className="mx-auto max-w-[1366px] px-lg pt-xxl md:px-xxl" id="symptom-analysis">
      <div className="rounded-xl border border-outline-variant bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
        <div className="flex flex-col gap-sm border-b border-outline-variant pb-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
              <Icon name="diagnosis" className="text-2xl" />
            </div>
            <div>
              <p className="font-label-md text-label-md text-primary">Kết quả phân tích</p>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Triệu chứng liên quan</h2>
            </div>
          </div>
          {symptoms.length > 0 && (
            <span className="rounded-lg bg-primary-fixed px-md py-xs font-label-sm text-label-sm text-on-primary-fixed">
              {symptoms.length} triệu chứng phù hợp
            </span>
          )}
        </div>

        {symptoms.length === 0 ? (
          <div className="py-xl text-center">
            <Icon className="text-4xl text-outline" name="search_off" />
            <p className="mt-sm font-label-md text-label-md text-on-surface">Chưa nhận diện được triệu chứng phù hợp</p>
            <p className="mx-auto mt-xs max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
              Hãy mô tả cụ thể hơn, ví dụ vị trí đau, thời gian xuất hiện, mức độ đau hoặc dấu hiệu đi kèm.
            </p>
          </div>
        ) : (
          <div className="mt-lg grid gap-md md:grid-cols-2">
            {symptoms.map((symptom) => {
              const conditions = inferCommonConditions(symptom)

              return (
                <article className="rounded-lg border border-outline-variant bg-surface p-md" key={symptom.id}>
                  <div className="flex items-start justify-between gap-md">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{symptom.name}</h3>
                      {symptom.body_part && (
                        <p className="mt-xs font-label-sm text-label-sm text-primary">{symptom.body_part}</p>
                      )}
                    </div>
                    <Icon className="text-primary" name="medical_information" />
                  </div>
                  <p className="mt-md font-body-sm text-body-sm text-on-surface-variant">
                    {symptom.description || buildFallbackDescription(symptom)}
                  </p>
                  <div className="mt-md rounded-lg bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface">Thường có thể gặp trong</p>
                    <div className="mt-sm flex flex-wrap gap-xs">
                      {conditions.map((condition) => (
                        <span className="rounded-lg bg-surface-container-lowest px-sm py-xs font-body-sm text-body-sm text-on-surface-variant" key={condition}>
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-sm font-body-sm text-body-sm text-outline">
                    Thông tin này chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ.
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default SymptomAnalysisPanel
