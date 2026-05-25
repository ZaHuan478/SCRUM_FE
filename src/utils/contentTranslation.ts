import type { Language } from '../contexts/LanguageContext'

const departmentNames = {
  en: {
    'Khoa Cấp cứu': 'Emergency Department',
    'Khoa Chẩn đoán hình ảnh': 'Diagnostic Imaging',
    'Khoa Chấn Thương Chỉnh Hình': 'Trauma and Orthopedics',
    'Khoa Cơ xương khớp': 'Rheumatology and Musculoskeletal Medicine',
    'Khoa Da liễu': 'Dermatology',
    'Khoa Dinh dưỡng': 'Nutrition',
    'Khoa Hô hấp': 'Pulmonology',
    'Khoa Mắt': 'Ophthalmology',
    'Khoa Ngoại tổng quát': 'General Surgery',
    'Khoa Nhi': 'Pediatrics',
    'Khoa Nội tiết': 'Endocrinology',
    'Khoa Nội tổng quát': 'General Internal Medicine',
    'Khoa Phục hồi chức năng': 'Rehabilitation Medicine',
    'Khoa Răng Hàm Mặt': 'Odonto-Stomatology',
    'Khoa Sản phụ khoa': 'Obstetrics and Gynecology',
    'Khoa Tai Mũi Họng': 'Ear, Nose and Throat',
    'Khoa Tâm thần': 'Psychiatry',
    'Khoa Thận - Tiết niệu': 'Nephrology and Urology',
    'Khoa Thần kinh': 'Neurology',
    'Khoa Tiêu hóa': 'Gastroenterology',
    'Khoa Tim mạch': 'Cardiology',
    'Khoa Truyền nhiễm': 'Infectious Diseases',
    'Khoa Ung bướu': 'Oncology',
    'Khoa Xét nghiệm': 'Laboratory Medicine',
    'Khoa Y học cổ truyền': 'Traditional Medicine',
    'Chưa phân khoa': 'Unassigned department',
  },
  ja: {
    'Khoa Cấp cứu': '救急科',
    'Khoa Chẩn đoán hình ảnh': '画像診断科',
    'Khoa Chấn Thương Chỉnh Hình': '外傷・整形外科',
    'Khoa Cơ xương khớp': 'リウマチ・筋骨格科',
    'Khoa Da liễu': '皮膚科',
    'Khoa Dinh dưỡng': '栄養科',
    'Khoa Hô hấp': '呼吸器科',
    'Khoa Mắt': '眼科',
    'Khoa Ngoại tổng quát': '一般外科',
    'Khoa Nhi': '小児科',
    'Khoa Nội tiết': '内分泌科',
    'Khoa Nội tổng quát': '総合内科',
    'Khoa Phục hồi chức năng': 'リハビリテーション科',
    'Khoa Răng Hàm Mặt': '歯科・口腔外科',
    'Khoa Sản phụ khoa': '産婦人科',
    'Khoa Tai Mũi Họng': '耳鼻咽喉科',
    'Khoa Tâm thần': '精神科',
    'Khoa Thận - Tiết niệu': '腎臓・泌尿器科',
    'Khoa Thần kinh': '神経内科',
    'Khoa Tiêu hóa': '消化器科',
    'Khoa Tim mạch': '循環器科',
    'Khoa Truyền nhiễm': '感染症科',
    'Khoa Ung bướu': '腫瘍科',
    'Khoa Xét nghiệm': '検査医学科',
    'Khoa Y học cổ truyền': '伝統医学科',
    'Chưa phân khoa': '未割り当ての診療科',
  },
} as const

const departmentDescriptions = {
  en: {
    'Tư vấn xét nghiệm, đọc kết quả sinh hóa, huyết học, miễn dịch và vi sinh phục vụ chẩn đoán.': 'Consultation on laboratory testing and interpretation of biochemistry, hematology, immunology, and microbiology results for diagnosis.',
    'Tư vấn chỉ định và đọc kết quả X-quang, siêu âm, CT, MRI và các kỹ thuật hình ảnh.': 'Consultation on imaging indications and interpretation of X-ray, ultrasound, CT, MRI, and other imaging results.',
    'Khám và điều trị bằng y học cổ truyền, châm cứu, xoa bóp bấm huyệt và dưỡng sinh.': 'Examination and treatment with traditional medicine, acupuncture, acupressure massage, and wellness practices.',
    'Tư vấn dinh dưỡng lâm sàng, kiểm soát cân nặng, dinh dưỡng bệnh lý và chế độ ăn cá nhân hóa.': 'Clinical nutrition consultation, weight management, disease-specific nutrition, and personalized meal planning.',
    'Khám và tư vấn rối loạn lo âu, trầm cảm, mất ngủ, stress và các vấn đề sức khỏe tâm thần.': 'Assessment and counseling for anxiety, depression, insomnia, stress, and mental health concerns.',
    'Tư vấn vật lý trị liệu, phục hồi vận động, phục hồi sau chấn thương và sau đột quỵ.': 'Physical therapy consultation, movement rehabilitation, and recovery after injury or stroke.',
    'Khám và điều trị bệnh truyền nhiễm, sốt kéo dài, viêm gan, cúm và bệnh nhiễm khuẩn.': 'Examination and treatment of infectious diseases, prolonged fever, hepatitis, influenza, and bacterial infections.',
    'Tiếp nhận, đánh giá ban đầu và xử trí các tình huống cấp cứu, chấn thương và bệnh cấp tính.': 'Initial assessment and management of emergencies, injuries, and acute illnesses.',
    'Tư vấn tầm soát, chẩn đoán, điều trị và theo dõi các bệnh lý ung bướu.': 'Cancer screening, diagnosis, treatment planning, and oncology follow-up.',
    'Khám và điều trị bệnh thận, tiết niệu, sỏi tiết niệu, nhiễm trùng tiểu và suy thận.': 'Examination and treatment of kidney and urinary diseases, urinary stones, urinary infections, and kidney failure.',
    'Khám răng miệng, nha khoa tổng quát, bệnh lý hàm mặt và tư vấn chăm sóc răng miệng.': 'Oral examination, general dentistry, maxillofacial conditions, and oral care consultation.',
    'Khám mắt, tật khúc xạ, viêm kết mạc, đục thủy tinh thể và bệnh lý võng mạc.': 'Eye exams, refractive errors, conjunctivitis, cataracts, and retinal diseases.',
    'Quản lý đái tháo đường, rối loạn tuyến giáp, rối loạn chuyển hóa và bệnh lý nội tiết.': 'Management of diabetes, thyroid disorders, metabolic disorders, and endocrine diseases.',
    'Tư vấn và điều trị bệnh dạ dày, đại tràng, gan mật, tụy và rối loạn tiêu hóa.': 'Consultation and treatment for stomach, colon, hepatobiliary, pancreatic, and digestive disorders.',
    'Khám và điều trị hen phế quản, COPD, viêm phổi, ho kéo dài và rối loạn hô hấp khi ngủ.': 'Examination and treatment of asthma, COPD, pneumonia, persistent cough, and sleep-related breathing disorders.',
    'Quản lý đau khớp, thoái hóa khớp, viêm khớp, loãng xương và các bệnh lý mô liên kết.': 'Management of joint pain, osteoarthritis, arthritis, osteoporosis, and connective tissue diseases.',
    'Khám và điều trị đau đầu, chóng mặt, đột quỵ, động kinh, rối loạn vận động và bệnh thần kinh ngoại biên.': 'Examination and treatment of headaches, dizziness, stroke, epilepsy, movement disorders, and peripheral neuropathy.',
    'Chẩn đoán và điều trị bệnh da, tóc, móng, dị ứng da và tư vấn chăm sóc da y khoa.': 'Diagnosis and treatment of skin, hair, nail, and skin allergy conditions, plus medical skin care advice.',
    'Khám và điều trị bệnh lý tai, mũi, họng, viêm xoang, viêm amidan và rối loạn thính lực.': 'Examination and treatment of ear, nose, throat, sinus, tonsil, and hearing disorders.',
    'Khám nhi khoa, theo dõi phát triển, tư vấn tiêm chủng và điều trị bệnh thường gặp ở trẻ em.': 'Pediatric care, growth monitoring, vaccination counseling, and treatment of common childhood illnesses.',
    'Tư vấn, khám và điều trị các bệnh lý ngoại khoa tổng quát, theo dõi trước và sau phẫu thuật.': 'Consultation, examination, and treatment of general surgical conditions with pre- and post-operative follow-up.',
    'Khám và quản lý các bệnh nội khoa thường gặp, bệnh mạn tính và chăm sóc sức khỏe tổng quát.': 'Assessment and management of common internal medicine conditions, chronic diseases, and general health care.',
    'Điều trị chấn thương, gãy xương, bệnh lý cơ xương khớp và phục hồi sau phẫu thuật chỉnh hình.': 'Treatment of injuries, fractures, musculoskeletal conditions, and rehabilitation after orthopedic surgery.',
    'Chăm sóc sức khỏe phụ nữ, thai sản, phụ khoa, tư vấn tiền sản và theo dõi thai kỳ.': 'Women’s health, maternity and gynecologic care, prenatal counseling, and pregnancy monitoring.',
    'Khám, tư vấn và điều trị các bệnh lý tim mạch, tăng huyết áp, rối loạn nhịp tim và suy tim.': 'Examination, consultation, and treatment of cardiovascular disease, hypertension, arrhythmias, and heart failure.',
  },
  ja: {
    'Tư vấn xét nghiệm, đọc kết quả sinh hóa, huyết học, miễn dịch và vi sinh phục vụ chẩn đoán.': '診断に必要な検査相談と、生化学・血液学・免疫学・微生物学検査結果の解釈を行います。',
    'Tư vấn chỉ định và đọc kết quả X-quang, siêu âm, CT, MRI và các kỹ thuật hình ảnh.': 'X線、超音波、CT、MRIなどの画像検査の適応相談と結果解釈を行います。',
    'Khám và điều trị bằng y học cổ truyền, châm cứu, xoa bóp bấm huyệt và dưỡng sinh.': '伝統医学、鍼灸、指圧マッサージ、養生法による診療を行います。',
    'Tư vấn dinh dưỡng lâm sàng, kiểm soát cân nặng, dinh dưỡng bệnh lý và chế độ ăn cá nhân hóa.': '臨床栄養、体重管理、疾患別栄養、個別の食事計画を相談できます。',
    'Khám và tư vấn rối loạn lo âu, trầm cảm, mất ngủ, stress và các vấn đề sức khỏe tâm thần.': '不安、うつ、不眠、ストレスなどのメンタルヘルス相談と診療を行います。',
    'Tư vấn vật lý trị liệu, phục hồi vận động, phục hồi sau chấn thương và sau đột quỵ.': '理学療法、運動機能回復、外傷後・脳卒中後のリハビリを相談できます。',
    'Khám và điều trị bệnh truyền nhiễm, sốt kéo dài, viêm gan, cúm và bệnh nhiễm khuẩn.': '感染症、長引く発熱、肝炎、インフルエンザ、細菌感染症の診療を行います。',
    'Tiếp nhận, đánh giá ban đầu và xử trí các tình huống cấp cứu, chấn thương và bệnh cấp tính.': '救急、外傷、急性疾患の初期評価と対応を行います。',
    'Tư vấn tầm soát, chẩn đoán, điều trị và theo dõi các bệnh lý ung bướu.': 'がんのスクリーニング、診断、治療、フォローアップを相談できます。',
    'Khám và điều trị bệnh thận, tiết niệu, sỏi tiết niệu, nhiễm trùng tiểu và suy thận.': '腎臓・尿路疾患、尿路結石、尿路感染、腎不全の診療を行います。',
    'Khám răng miệng, nha khoa tổng quát, bệnh lý hàm mặt và tư vấn chăm sóc răng miệng.': '口腔診療、一般歯科、顎顔面疾患、口腔ケア相談を行います。',
    'Khám mắt, tật khúc xạ, viêm kết mạc, đục thủy tinh thể và bệnh lý võng mạc.': '眼科診療、屈折異常、結膜炎、白内障、網膜疾患に対応します。',
    'Quản lý đái tháo đường, rối loạn tuyến giáp, rối loạn chuyển hóa và bệnh lý nội tiết.': '糖尿病、甲状腺疾患、代謝異常、内分泌疾患を管理します。',
    'Tư vấn và điều trị bệnh dạ dày, đại tràng, gan mật, tụy và rối loạn tiêu hóa.': '胃、大腸、肝胆道、膵臓、消化器疾患の相談と治療を行います。',
    'Khám và điều trị hen phế quản, COPD, viêm phổi, ho kéo dài và rối loạn hô hấp khi ngủ.': '気管支喘息、COPD、肺炎、長引く咳、睡眠時呼吸障害を診療します。',
    'Quản lý đau khớp, thoái hóa khớp, viêm khớp, loãng xương và các bệnh lý mô liên kết.': '関節痛、変形性関節症、関節炎、骨粗しょう症、結合組織疾患を管理します。',
    'Khám và điều trị đau đầu, chóng mặt, đột quỵ, động kinh, rối loạn vận động và bệnh thần kinh ngoại biên.': '頭痛、めまい、脳卒中、てんかん、運動障害、末梢神経疾患を診療します。',
    'Chẩn đoán và điều trị bệnh da, tóc, móng, dị ứng da và tư vấn chăm sóc da y khoa.': '皮膚、毛髪、爪、皮膚アレルギーの診断治療と医療スキンケア相談を行います。',
    'Khám và điều trị bệnh lý tai, mũi, họng, viêm xoang, viêm amidan và rối loạn thính lực.': '耳・鼻・喉、 sinus炎、扁桃炎、聴覚障害を診療します。',
    'Khám nhi khoa, theo dõi phát triển, tư vấn tiêm chủng và điều trị bệnh thường gặp ở trẻ em.': '小児診療、発育フォロー、予防接種相談、子どもによくある病気の治療を行います。',
    'Tư vấn, khám và điều trị các bệnh lý ngoại khoa tổng quát, theo dõi trước và sau phẫu thuật.': '一般外科疾患の相談・診療・治療、術前術後フォローを行います。',
    'Khám và quản lý các bệnh nội khoa thường gặp, bệnh mạn tính và chăm sóc sức khỏe tổng quát.': '一般的な内科疾患、慢性疾患、総合的な健康管理を行います。',
    'Điều trị chấn thương, gãy xương, bệnh lý cơ xương khớp và phục hồi sau phẫu thuật chỉnh hình.': '外傷、骨折、筋骨格疾患、整形外科術後リハビリを扱います。',
    'Chăm sóc sức khỏe phụ nữ, thai sản, phụ khoa, tư vấn tiền sản và theo dõi thai kỳ.': '女性の健康、妊産婦ケア、婦人科、出生前相談、妊娠経過観察を行います。',
    'Khám, tư vấn và điều trị các bệnh lý tim mạch, tăng huyết áp, rối loạn nhịp tim và suy tim.': '心血管疾患、高血圧、不整脈、心不全の診療・相談・治療を行います。',
  },
} as const

const doctorDescriptions = {
  en: {
    'Bác sĩ Nội tiết quản lý đái tháo đường, rối loạn tuyến giáp, béo phì và rối loạn chuyển hóa.': 'Endocrinologist managing diabetes, thyroid disorders, obesity, and metabolic disorders.',
    'Bác sĩ Ung bướu tư vấn tầm soát ung thư, đọc kết quả xét nghiệm và theo dõi điều trị.': 'Oncologist providing cancer screening advice, test result interpretation, and treatment follow-up.',
    'Bác sĩ Thận - Tiết niệu chuyên quản lý bệnh thận mạn, tăng huyết áp thận và lọc máu.': 'Nephrology and urology specialist managing chronic kidney disease, renal hypertension, and dialysis.',
    'Bác sĩ Thận - Tiết niệu khám sỏi tiết niệu, nhiễm trùng tiểu, suy thận và rối loạn tiểu tiện.': 'Nephrology and urology doctor for urinary stones, urinary tract infections, kidney failure, and urination disorders.',
    'Bác sĩ Răng Hàm Mặt chuyên bệnh lý hàm mặt, nhổ răng khó và phục hình răng.': 'Odonto-stomatology doctor specializing in maxillofacial conditions, complex tooth extraction, and dental restoration.',
    'Bác sĩ Răng Hàm Mặt khám răng miệng, viêm nướu, sâu răng và tư vấn điều trị nha khoa.': 'Odonto-stomatology doctor for oral exams, gingivitis, tooth decay, and dental treatment advice.',
    'Bác sĩ Mắt chuyên bệnh võng mạc, đục thủy tinh thể, glôcôm và theo dõi sau phẫu thuật.': 'Ophthalmologist specializing in retinal disease, cataracts, glaucoma, and post-operative follow-up.',
    'Bác sĩ Mắt khám tật khúc xạ, khô mắt, viêm kết mạc và tư vấn chăm sóc thị lực.': 'Ophthalmologist for refractive errors, dry eyes, conjunctivitis, and vision care advice.',
    'Bác sĩ Nội tiết chuyên theo dõi bệnh nội tiết mạn tính, biến chứng đái tháo đường và hormone.': 'Endocrinologist monitoring chronic endocrine diseases, diabetes complications, and hormone disorders.',
    'Bác sĩ Ung bướu chuyên lập kế hoạch điều trị, chăm sóc giảm nhẹ và theo dõi sau điều trị.': 'Oncologist specializing in treatment planning, palliative care, and post-treatment follow-up.',
    'Bác sĩ Tiêu hóa chuyên theo dõi viêm gan, bệnh tụy, bệnh ruột mạn tính và nội soi tiêu hóa.': 'Gastroenterologist monitoring hepatitis, pancreatic disease, chronic bowel disease, and digestive endoscopy.',
    'Bác sĩ Tiêu hóa tư vấn gan mật, men gan cao, táo bón, tiêu chảy và dinh dưỡng tiêu hóa.': 'Gastroenterologist advising on hepatobiliary issues, high liver enzymes, constipation, diarrhea, and digestive nutrition.',
    'Bác sĩ Tiêu hóa khám đau dạ dày, trào ngược, rối loạn tiêu hóa và bệnh đại tràng.': 'Gastroenterologist for stomach pain, reflux, digestive disorders, and colon disease.',
    'Bác sĩ Hô hấp chuyên quản lý bệnh phổi mạn tính, rối loạn hô hấp khi ngủ và cai thuốc lá.': 'Pulmonologist managing chronic lung disease, sleep-related breathing disorders, and smoking cessation.',
    'Bác sĩ Hô hấp khám ho kéo dài, hen phế quản, COPD, viêm phổi và khó thở.': 'Pulmonologist for persistent cough, asthma, COPD, pneumonia, and shortness of breath.',
    'Bác sĩ Cơ xương khớp chuyên theo dõi viêm khớp tự miễn và bệnh lý mô liên kết.': 'Musculoskeletal specialist monitoring autoimmune arthritis and connective tissue diseases.',
    'Bác sĩ Cơ xương khớp tư vấn đau cơ, đau vai gáy, bệnh gút và phục hồi vận động.': 'Musculoskeletal doctor advising on muscle pain, neck and shoulder pain, gout, and movement rehabilitation.',
    'Bác sĩ Cơ xương khớp khám viêm khớp, thoái hóa khớp, đau lưng và loãng xương.': 'Musculoskeletal doctor for arthritis, osteoarthritis, back pain, and osteoporosis.',
    'Bác sĩ Tâm thần chuyên quản lý rối loạn khí sắc, rối loạn giấc ngủ và trị liệu phối hợp.': 'Psychiatrist specializing in mood disorders, sleep disorders, and combined therapy.',
    'Bác sĩ Xét nghiệm chuyên phân tích kết quả xét nghiệm phức tạp, vi sinh và theo dõi điều trị.': 'Laboratory medicine doctor specializing in complex lab result analysis, microbiology, and treatment monitoring.',
    'Bác sĩ Xét nghiệm tư vấn lựa chọn xét nghiệm, đọc kết quả sinh hóa, huyết học và miễn dịch.': 'Laboratory medicine doctor advising on test selection and interpreting biochemistry, hematology, and immunology results.',
    'Bác sĩ Chẩn đoán hình ảnh chuyên đánh giá hình ảnh tim phổi, ổ bụng, thần kinh và cơ xương.': 'Diagnostic imaging doctor specializing in cardiopulmonary, abdominal, neurologic, and musculoskeletal imaging.',
    'Bác sĩ Chẩn đoán hình ảnh tư vấn chỉ định và đọc kết quả X-quang, siêu âm, CT và MRI.': 'Diagnostic imaging doctor advising on indications and interpreting X-ray, ultrasound, CT, and MRI results.',
    'Bác sĩ Y học cổ truyền chuyên kết hợp điều trị phục hồi vận động, mất ngủ và đau cơ xương.': 'Traditional medicine doctor combining care for movement recovery, insomnia, and musculoskeletal pain.',
    'Bác sĩ Y học cổ truyền tư vấn châm cứu, xoa bóp bấm huyệt, đau mạn tính và dưỡng sinh.': 'Traditional medicine doctor advising on acupuncture, acupressure massage, chronic pain, and wellness practices.',
    'Bác sĩ Dinh dưỡng chuyên dinh dưỡng bệnh lý, dinh dưỡng nhi khoa và kế hoạch ăn cá nhân hóa.': 'Nutrition doctor specializing in disease-specific nutrition, pediatric nutrition, and personalized meal planning.',
    'Bác sĩ Dinh dưỡng tư vấn chế độ ăn cho kiểm soát cân nặng, đái tháo đường và tim mạch.': 'Nutrition doctor advising on diets for weight control, diabetes, and cardiovascular health.',
    'Bác sĩ Thần kinh chuyên quản lý bệnh thần kinh mạn tính, rối loạn vận động và sa sút trí tuệ.': 'Neurologist managing chronic neurologic disease, movement disorders, and dementia.',
    'Bác sĩ Tâm thần tư vấn lo âu, trầm cảm, mất ngủ, stress và chăm sóc sức khỏe tinh thần.': 'Psychiatrist advising on anxiety, depression, insomnia, stress, and mental health care.',
    'Bác sĩ Phục hồi chức năng chuyên phục hồi sau đột quỵ, sau phẫu thuật và cải thiện vận động.': 'Rehabilitation physician specializing in recovery after stroke, after surgery, and movement improvement.',
    'Bác sĩ Phục hồi chức năng tư vấn vật lý trị liệu, phục hồi sau chấn thương và đau cơ xương.': 'Rehabilitation physician advising on physical therapy, injury recovery, and musculoskeletal pain.',
    'Bác sĩ Truyền nhiễm chuyên quản lý bệnh truyền nhiễm mạn tính, nhiễm khuẩn phức tạp và tiêm ngừa.': 'Infectious disease doctor managing chronic infections, complex bacterial infections, and vaccination.',
    'Bác sĩ Truyền nhiễm khám sốt kéo dài, cúm, viêm gan, bệnh nhiễm khuẩn và tư vấn cách ly.': 'Infectious disease doctor for prolonged fever, influenza, hepatitis, bacterial infections, and isolation advice.',
    'Bác sĩ Cấp cứu chuyên xử trí cấp cứu nội ngoại khoa, hồi sức ban đầu và chuyển tuyến phù hợp.': 'Emergency doctor specializing in medical and surgical emergencies, initial resuscitation, and appropriate referral.',
    'Bác sĩ Cấp cứu hỗ trợ phân loại mức độ nguy cấp và tư vấn xử trí ban đầu an toàn.': 'Emergency doctor supporting triage and safe initial management advice.',
    'Bác sĩ Cấp cứu đánh giá triệu chứng cấp tính, chấn thương, đau ngực, khó thở và sốt cao.': 'Emergency doctor assessing acute symptoms, injuries, chest pain, shortness of breath, and high fever.',
    'Bác sĩ Thần kinh tư vấn mất ngủ, đau dây thần kinh, động kinh và phục hồi sau đột quỵ.': 'Neurologist advising on insomnia, neuralgia, epilepsy, and post-stroke rehabilitation.',
    'Bác sĩ Tim mạch phụ trách khám tăng huyết áp, đau ngực, rối loạn nhịp và tư vấn phòng ngừa bệnh tim.': 'Cardiologist for hypertension, chest pain, arrhythmias, and heart disease prevention.',
    'Bác sĩ Tim mạch có kinh nghiệm theo dõi suy tim, bệnh mạch vành và quản lý nguy cơ tim mạch.': 'Cardiologist experienced in monitoring heart failure, coronary artery disease, and cardiovascular risk.',
    'Bác sĩ Tim mạch chuyên tư vấn chuyên sâu về rối loạn nhịp, siêu âm tim và điều trị bệnh tim mạn tính.': 'Cardiologist specializing in arrhythmias, echocardiography, and chronic heart disease treatment.',
    'Bác sĩ Sản phụ khoa khám thai, tư vấn tiền sản, theo dõi thai kỳ nguy cơ và bệnh lý phụ khoa.': 'Obstetrician-gynecologist for prenatal care, prenatal counseling, high-risk pregnancy monitoring, and gynecologic conditions.',
    'Bác sĩ Sản phụ khoa hỗ trợ chăm sóc sức khỏe sinh sản, rối loạn kinh nguyệt và viêm nhiễm phụ khoa.': 'Obstetrician-gynecologist supporting reproductive health, menstrual disorders, and gynecologic infections.',
    'Bác sĩ Sản phụ khoa chuyên tư vấn thai kỳ, sàng lọc trước sinh và xử trí bệnh phụ khoa thường gặp.': 'Obstetrician-gynecologist specializing in pregnancy counseling, prenatal screening, and common gynecologic conditions.',
    'Bác sĩ Chấn thương Chỉnh hình khám đau khớp, chấn thương thể thao, gãy xương và phục hồi sau phẫu thuật.': 'Trauma and orthopedic doctor for joint pain, sports injuries, fractures, and post-operative rehabilitation.',
    'Bác sĩ Chấn thương Chỉnh hình tư vấn bong gân, đau vai gáy, đau lưng và chấn thương mô mềm.': 'Trauma and orthopedic doctor advising on sprains, neck and shoulder pain, back pain, and soft tissue injuries.',
    'Bác sĩ Chấn thương Chỉnh hình chuyên điều trị bệnh lý khớp, cột sống và theo dõi phục hồi chức năng.': 'Trauma and orthopedic doctor specializing in joint and spine conditions and rehabilitation follow-up.',
    'Bác sĩ Nội tổng quát khám bệnh nội khoa, quản lý bệnh mạn tính và tư vấn kiểm tra sức khỏe định kỳ.': 'General internist for internal medicine conditions, chronic disease management, and routine health checkups.',
    'Bác sĩ Nội tổng quát hỗ trợ đánh giá triệu chứng ban đầu, sốt, mệt mỏi và các bệnh lý thường gặp.': 'General internist supporting initial symptom assessment, fever, fatigue, and common conditions.',
    'Bác sĩ Nội tổng quát có kinh nghiệm phối hợp điều trị đa bệnh lý và tư vấn chăm sóc sức khỏe dài hạn.': 'General internist experienced in coordinated care for multiple conditions and long-term health counseling.',
    'Bác sĩ Ngoại tổng quát tư vấn vết thương, nhiễm trùng phần mềm và các thủ thuật ngoại khoa nhỏ.': 'General surgeon advising on wounds, soft tissue infections, and minor surgical procedures.',
    'Bác sĩ Ngoại tổng quát khám đau bụng ngoại khoa, thoát vị, viêm ruột thừa và chăm sóc sau phẫu thuật.': 'General surgeon for surgical abdominal pain, hernia, appendicitis, and post-operative care.',
    'Bác sĩ Thần kinh khám đau đầu, chóng mặt, tê yếu tay chân và rối loạn thần kinh ngoại biên.': 'Neurologist for headaches, dizziness, limb numbness or weakness, and peripheral nerve disorders.',
    'Bác sĩ Da liễu chuyên điều trị bệnh da mạn tính, rụng tóc, rối loạn sắc tố và bệnh móng.': 'Dermatologist specializing in chronic skin disease, hair loss, pigment disorders, and nail disease.',
    'Bác sĩ Da liễu khám mụn, viêm da, dị ứng, nấm da và tư vấn chăm sóc da y khoa.': 'Dermatologist for acne, dermatitis, allergies, fungal skin infections, and medical skin care advice.',
    'Bác sĩ Tai Mũi Họng tư vấn dị ứng mũi, ngáy ngủ, viêm amidan và chăm sóc sau thủ thuật.': 'ENT doctor advising on nasal allergies, snoring, tonsillitis, and post-procedure care.',
    'Bác sĩ Tai Mũi Họng khám viêm xoang, viêm họng, viêm tai, ù tai và rối loạn giọng nói.': 'ENT doctor for sinusitis, sore throat, ear infections, tinnitus, and voice disorders.',
    'Bác sĩ Nhi có kinh nghiệm quản lý bệnh mạn tính ở trẻ và tư vấn dinh dưỡng nhi khoa.': 'Pediatrician experienced in managing chronic childhood disease and pediatric nutrition counseling.',
    'Bác sĩ Nhi hỗ trợ theo dõi tăng trưởng, tư vấn tiêm chủng và xử trí bệnh thường gặp ở trẻ.': 'Pediatrician supporting growth monitoring, vaccination counseling, and common childhood illness care.',
    'Bác sĩ Nhi khám bệnh hô hấp, tiêu hóa, sốt, dị ứng và tư vấn chăm sóc trẻ theo từng độ tuổi.': 'Pediatrician for respiratory and digestive illness, fever, allergies, and age-based child care advice.',
    'Bác sĩ Ngoại tổng quát chuyên đánh giá chỉ định phẫu thuật và theo dõi phục hồi hậu phẫu.': 'General surgeon specializing in surgical indication assessment and post-operative recovery follow-up.',
    'Bác sĩ Hô hấp, chẩn đoán và điều trị bệnh lý phổi, hen, COPD và nhiễm trùng hô hấp.': 'Pulmonologist diagnosing and treating lung disease, asthma, COPD, and respiratory infections.',
    'Bác sĩ Cơ xương khớp, điều trị bệnh lý xương, khớp, cơ và cột sống.': 'Musculoskeletal doctor treating bone, joint, muscle, and spine conditions.',
    'Bác sĩ Thần kinh, điều trị bệnh lý não bộ, tủy sống, đau đầu và rối loạn thần kinh.': 'Neurologist treating brain, spinal cord, headache, and neurologic disorders.',
    'Bác sĩ Da liễu, khám và điều trị bệnh lý da, tóc, móng và dị ứng da.': 'Dermatologist diagnosing and treating skin, hair, nail, and skin allergy conditions.',
    'Bác sĩ Tai Mũi Họng, điều trị bệnh lý tai, mũi, họng, xoang và thanh quản.': 'ENT doctor treating ear, nose, throat, sinus, and laryngeal conditions.',
    'Bác sĩ Sản phụ khoa, chăm sóc thai kỳ, sức khỏe sinh sản và điều trị bệnh phụ khoa.': 'Obstetrician-gynecologist for pregnancy care, reproductive health, and gynecologic treatment.',
    'Bác sĩ Nhi khoa, khám và theo dõi sức khỏe trẻ em từ sơ sinh đến thiếu niên.': 'Pediatrician providing care and health monitoring from newborns to adolescents.',
    'Bác sĩ Ngoại tổng quát, chẩn đoán và điều trị các bệnh lý ngoại khoa cần can thiệp phẫu thuật.': 'General surgeon diagnosing and treating surgical conditions that may require procedures.',
    'Bác sĩ Nội tổng quát, tiếp nhận bệnh lý nội khoa thường gặp và tư vấn chăm sóc sức khỏe tổng quát.': 'General internist for common internal medicine conditions and general health counseling.',
    'Bác sĩ chuyên khoa Tim mạch, phụ trách khám và điều trị tăng huyết áp, suy tim, rối loạn nhịp tim.': 'Cardiology specialist for hypertension, heart failure, and arrhythmia care.',
    'Bác sĩ chấn thương chỉnh hình': 'Trauma and orthopedic doctor.',
    'Bác sĩ khám thai': 'Prenatal care doctor.',
  },
  ja: {
    'Bác sĩ Nội tiết quản lý đái tháo đường, rối loạn tuyến giáp, béo phì và rối loạn chuyển hóa.': '糖尿病、甲状腺疾患、肥満、代謝異常を管理する内分泌医です。',
    'Bác sĩ Ung bướu tư vấn tầm soát ung thư, đọc kết quả xét nghiệm và theo dõi điều trị.': 'がん検診の相談、検査結果の解釈、治療フォローを行う腫瘍医です。',
    'Bác sĩ Thận - Tiết niệu chuyên quản lý bệnh thận mạn, tăng huyết áp thận và lọc máu.': '慢性腎臓病、腎性高血圧、透析管理を専門とする腎臓・泌尿器科医です。',
    'Bác sĩ Thận - Tiết niệu khám sỏi tiết niệu, nhiễm trùng tiểu, suy thận và rối loạn tiểu tiện.': '尿路結石、尿路感染、腎不全、排尿障害を診療する腎臓・泌尿器科医です。',
    'Bác sĩ Răng Hàm Mặt chuyên bệnh lý hàm mặt, nhổ răng khó và phục hình răng.': '顎顔面疾患、難抜歯、歯科補綴を専門とする歯科・口腔外科医です。',
    'Bác sĩ Răng Hàm Mặt khám răng miệng, viêm nướu, sâu răng và tư vấn điều trị nha khoa.': '口腔診療、歯肉炎、虫歯、歯科治療相談を行う歯科・口腔外科医です。',
    'Bác sĩ Mắt chuyên bệnh võng mạc, đục thủy tinh thể, glôcôm và theo dõi sau phẫu thuật.': '網膜疾患、白内障、緑内障、術後フォローを専門とする眼科医です。',
    'Bác sĩ Mắt khám tật khúc xạ, khô mắt, viêm kết mạc và tư vấn chăm sóc thị lực.': '屈折異常、ドライアイ、結膜炎、視力ケア相談を行う眼科医です。',
    'Bác sĩ Nội tiết chuyên theo dõi bệnh nội tiết mạn tính, biến chứng đái tháo đường và hormone.': '慢性内分泌疾患、糖尿病合併症、ホルモン異常をフォローする内分泌医です。',
    'Bác sĩ Ung bướu chuyên lập kế hoạch điều trị, chăm sóc giảm nhẹ và theo dõi sau điều trị.': '治療計画、緩和ケア、治療後フォローを専門とする腫瘍医です。',
  },
} as const

type Dictionary = Record<string, string>

const readDictionary = (dictionary: { en: Dictionary; ja: Dictionary }, language: Language) => {
  if (language === 'vi') return undefined
  return dictionary[language]
}

const normalize = (value?: string | null) => value?.trim() || ''
const hasVietnameseMedicalText = (value: string) => /Bác sĩ|Khoa|[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(value)

const translateSpecialty = (value: string, language: Language) => {
  const normalized = value.replace(/^Khoa\s+/i, '').trim()
  const departmentName = translateDepartmentName(`Khoa ${normalized}`, language)

  if (departmentName !== `Khoa ${normalized}`) return departmentName

  const fallback: Record<Language, Record<string, string>> = {
    vi: {},
    en: {
      'Nhi khoa': 'Pediatrics',
      'chấn thương chỉnh hình': 'Trauma and Orthopedics',
      'khám thai': 'Prenatal Care',
    },
    ja: {
      'Nhi khoa': '小児科',
      'chấn thương chỉnh hình': '外傷・整形外科',
      'khám thai': '妊婦健診',
    },
  }

  return fallback[language][normalized] || fallback[language][normalized.toLowerCase()] || normalized
}

const buildGenericDoctorDescription = (value: string, language: Language) => {
  if (language === 'vi') return value
  if (!hasVietnameseMedicalText(value)) return value

  const cleaned = value
    .replace(/^Bác sĩ chuyên khoa\s+/i, '')
    .replace(/^Bác sĩ\s+/i, '')
    .replace(/[,.].*$/, '')
    .trim()
  const specialtySource = cleaned
    .split(/\s+(?:chuyên|tư vấn|khám|có kinh nghiệm|hỗ trợ|phụ trách|chẩn đoán|điều trị|chăm sóc)\s+/i)[0]
    .trim()
  const specialty = translateSpecialty(specialtySource, language)

  if (language === 'ja') return `${specialty}の医師です。専門的な診療と相談を行います。`
  return `${specialty} doctor providing specialist consultation and treatment.`
}

export const translateDepartmentName = (value: string | null | undefined, language: Language) => {
  const text = normalize(value)
  return readDictionary(departmentNames, language)?.[text] || text
}

export const translateDepartmentDescription = (value: string | null | undefined, language: Language) => {
  const text = normalize(value)
  return readDictionary(departmentDescriptions, language)?.[text] || text
}

export const translateDoctorDescription = (value: string | null | undefined, language: Language) => {
  const text = normalize(value)
  return readDictionary(doctorDescriptions, language)?.[text] || buildGenericDoctorDescription(text, language)
}

export const translateDoctorBiography = (value: string | null | undefined, language: Language) => {
  const text = normalize(value)
  if (!text || language === 'vi') return text

  const match = text.match(/^(.+?) là bác sĩ đang công tác tại (Khoa .+?), có (\d+) năm kinh nghiệm/)
  if (!match) return text

  const [, name, department, years] = match
  const localizedDepartment = translateDepartmentName(department, language)

  if (language === 'ja') {
    return `${name}は${localizedDepartment}に所属する医師で、専門診療で${years}年の経験があります。症状を丁寧に聞き取り、治療計画をわかりやすく説明し、オンライン予約を利用しやすい形でサポートします。`
  }

  return `${name} is a doctor in ${localizedDepartment} with ${years} years of specialist clinical experience. The doctor focuses on listening carefully to symptoms, explaining treatment plans clearly, and helping patients book appointments online conveniently.`
}
