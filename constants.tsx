export const SURVEY_QUESTIONS = [
    {
        id: 'user_info',
        title: 'PART 1. 기본정보',
        questions: [
            { id: 'user_details', label: '0. 응답자 정보를 입력해주세요. (결과 확인 및 분석용)', type: 'multi-text', required: true, fields: [
                { id: 'name', placeholder: '이름 (예: 홍길동)' },
                { id: 'company', placeholder: '회사명 (예: 구루피플스, 프리랜서)' },
                { id: 'position', placeholder: '직책 (예: 팀장, 팀원, 책임)' },
            ]},
            { id: 'laptop_model', label: '1. 실무에 사용하시는 노트북 기종을 알려주세요.', description: '예: 맥북에어 M2, LG그램 15', type: 'text', required: true, placeholder: '노트북 기종 입력' },
            {
                id: 'laptop_year',
                label: '2. 노트북 제품 연식 또는 구매 연도를 선택해주세요.',
                type: 'radio',
                required: true,
                options: [
                    { value: '2025', label: '2025년' },
                    { value: '2024', label: '2024년' },
                    { value: '2023', label: '2023년' },
                    { value: '2022', label: '2022년' },
                    { value: '2021', label: '2021년' },
                    { value: '2020', label: '2020년' },
                    { value: '2019', label: '2019년' },
                    { value: '2018_before', label: '2018년 이전' },
                ]
            },
            {
                id: 'job_function',
                label: '3. 귀하의 핵심 직무(Function)를 선택해주세요',
                type: 'radio',
                required: true,
                options: [
                    { value: 'hrd', label: 'HRD (인재개발/교육)' },
                    { value: 'hrm', label: 'HRM (인사관리/노무)' },
                    { value: 'od', label: 'OD (조직개발/조직문화)' },
                    { value: 'recruiting', label: 'Recruiting (채용)' },
                    { value: 'sales', label: 'Sales (영업/세일즈)' },
                    { value: 'marketing', label: 'Marketing (마케팅/브랜딩)' },
                    { value: 'it_dev', label: 'IT/Development (IT/개발)' },
                    { value: 'design', label: 'Design (디자인)' },
                    { value: 'strategy_planning', label: 'Strategy/Planning (전략/기획)' },
                    { value: 'finance_accounting', label: 'Finance/Accounting (재무/회계)' },
                    { value: 'rnd', label: 'R&D (연구개발)' },
                    { value: 'other', label: '기타 (직접 입력)', hasTextInput: true },
                ]
            },
            {
                id: 'job_role',
                label: '4. 귀하의 주된 역할(Role)을 선택해주세요',
                type: 'radio',
                required: true,
                options: [
                    { value: 'executive', label: '👑 C-Level/임원' },
                    { value: 'leader', label: '🎩 리더/팀장' },
                    { value: 'senior', label: '🎓 책임/시니어' },
                    { value: 'junior', label: '🏃 실무자/주니어' },
                    { value: 'consultant', label: '💡 컨설턴트/강사/코치' },
                    { value: 'freelancer', label: '🚀 프리랜서/1인기업' },
                    { value: 'other', label: '기타 (직접 입력)', hasTextInput: true },
                ]
            },
            {
                id: 'company_size',
                label: '5. 소속 조직 규모는?',
                type: 'radio',
                options: [
                    { value: 'freelancer', label: '🙋 프리랜서 / 1인 기업' },
                    { value: 'under_30', label: '🚀 30명 미만 (스타트업/소규모)' },
                    { value: '30_99', label: '🏢 30-99명 (중소기업)' },
                    { value: '100_299', label: '🏭 100-299명 (중소기업)' },
                    { value: '300_499', label: '🏗️ 300-499명 (중견기업)' },
                    { value: '500_999', label: '🌆 500-999명 (중견기업)' },
                    { value: '1000_2999', label: '🏙️ 1,000-2,999명 (대기업)' },
                    { value: '3000_9999', label: '🌃 3,000-9,999명 (대기업)' },
                    { value: 'over_10000', label: '🌌 10,000명 이상 (대기업/공공기관)' },
                ]
            },
             {
                id: 'experience',
                label: '6. 현재 직무(역할) 관련 총 경력은?',
                type: 'radio',
                options: [
                   { value: 'under_1', label: '🌱 1년 미만' },
                   { value: '1_3', label: '🌿 1-3년' },
                   { value: '3_5', label: '🌳 3-5년' },
                   { value: '5_10', label: '🌲 5-10년' },
                   { value: '10_15', label: '🏔️ 10-15년' },
                   { value: 'over_15', label: '🌟 15년 이상' },
                ]
            },
        ]
    },
    {
        id: 'part2',
        title: 'PART 2. 조직의 AI 정책 및 환경',
        questions: [
            {
                id: 'ai_policy',
                label: '7. 귀하 조직의 AI 사용 정책 수준은?',
                type: 'radio',
                options: [
                    { value: 'formal_guideline', label: '📋 명문화된 AI 사용 가이드라인과 허용 도구 리스트 존재' },
                    { value: 'security_policy', label: '🔒 일반적인 정보보안 정책에 AI 사용 규정 포함' },
                    { value: 'informal_guideline', label: '💬 부서별 비공식 가이드라인 존재' },
                    { value: 'verbal_guidance', label: '🗣️ 구두 전달되는 간단한 주의사항만 존재' },
                    { value: 'no_policy', label: '🤷 특별한 정책이나 가이드라인 없음' },
                    { value: 'prohibited', label: '🚫 AI 사용 전면 금지 정책' },
                    { value: 'unknown', label: '❓ 정책 존재 여부를 모름' },
                ]
            },
            {
                id: 'allowed_tools',
                label: '8. 조직에서 공식적으로 허용/제공하는 AI 도구는? (복수선택)',
                type: 'checkbox',
                options: [
                    // Multimodal
                    { value: 'chatgpt_paid', label: '💎 ChatGPT (유료 버전/Plus/Team/Enterprise)' },
                    { value: 'claude_paid', label: '⭐ Claude (유료 버전/Pro/Team)' },
                    { value: 'gemini', label: '💫 Google Gemini' },
                    { value: 'copilot_m365', label: '🏢 Microsoft Copilot (Office 365/M365)' },
                    { value: 'notebooklm', label: '📒 Google NotebookLM' },
                    { value: 'groq', label: '⚡️ Groq' },
                    { value: 'wrtn', label: '🇰🇷 뤼튼 (Wrtn)' },
                    { value: 'hyperclova', label: '🔥 네이버 하이퍼클로바X' },
                    // Video
                    { value: 'sora', label: '🎬 OpenAI Sora' },
                    { value: 'runwayml', label: '🏃‍♀️ RunwayML' },
                    { value: 'pika', label: '✨ Pika Labs' },
                    // Image
                    { value: 'midjourney', label: '🎨 Midjourney' },
                    { value: 'stablediffusion', label: '🖼️ Stable Diffusion' },
                    { value: 'dalle', label: '🖌️ DALL-E' },
                    // Audio
                    { value: 'suno', label: '🎵 Suno AI' },
                    { value: 'udio', label: '🎶 Udio' },
                    // Other
                    { value: 'internal_ai', label: '🛠️ 사내 자체 개발 AI 플랫폼' },
                    { value: 'chatgpt_free', label: '🤖 ChatGPT (무료 버전)' },
                    { value: 'claude_free', label: '🎭 Claude (무료 버전)' },
                    { value: 'all_prohibited', label: '❌ 모든 외부 AI 도구 사용 금지' },
                    { value: 'unknown_tools', label: '❓ 허용 도구를 정확히 모름' },
                ]
            },
        ]
    },
    {
        id: 'part3',
        title: 'PART 3. 개인 AI 사용 경험',
        questions: [
            {
                id: 'first_use',
                label: '9. 개인적으로 AI 도구를 처음 사용한 시기는?',
                type: 'radio',
                options: [
                    { value: 'before_2022', label: '🦕 2021년 이전 (GPT-3 이전 시대)' },
                    { value: '2022', label: '🌅 2022년 (GPT-3 시대)' },
                    { value: 'early_2023', label: '🔥 2023년 초반 (ChatGPT 초기 열풍)' },
                    { value: 'mid_2023', label: '📈 2023년 중반' },
                    { value: 'late_2023', label: '🍂 2023년 하반기' },
                    { value: '2024', label: '⭐ 2024년' },
                    { value: '2025_onward', label: '🚀 2025년 이후' },
                    { value: 'never', label: '🤔 아직 사용해본 적 없음' },
                ]
            },
            {
                id: 'frequently_used',
                label: '10. 현재 개인적으로 가장 자주 사용하는 AI 도구는? (최대 3개)',
                type: 'checkbox',
                options: [
                    // Multimodal
                    { value: 'chatgpt', label: '🤖 ChatGPT' },
                    { value: 'claude', label: '🎭 Claude' },
                    { value: 'gemini', label: '💫 Google Gemini' },
                    { value: 'copilot', label: '🏢 Microsoft Copilot' },
                    { value: 'notebooklm', label: '📒 Google NotebookLM' },
                    { value: 'groq', label: '⚡️ Groq' },
                    { value: 'perplexity', label: '🔍 Perplexity AI' },
                    { value: 'wrtn', label: '🇰🇷 뤼튼 (Wrtn)' },
                    { value: 'notion_ai', label: '📝 Notion AI' },
                    // Video
                    { value: 'sora', label: '🎬 OpenAI Sora' },
                    { value: 'runwayml', label: '🏃‍♀️ RunwayML' },
                    { value: 'pika', label: '✨ Pika Labs' },
                    // Image
                    { value: 'midjourney', label: '🎨 Midjourney' },
                    { value: 'stablediffusion', label: '🖼️ Stable Diffusion' },
                    { value: 'dalle', label: '🖌️ DALL-E' },
                    // Audio
                    { value: 'suno', label: '🎵 Suno AI' },
                    { value: 'udio', label: '🎶 Udio' },
                    // Other
                    { value: 'none', label: '❌ 특별히 자주 쓰는 도구 없음' },
                ],
                maxSelection: 3
            },
            {
                id: 'usage_frequency',
                label: '11. 개인적인 AI 사용 빈도는?',
                type: 'radio',
                options: [
                    { value: 'very_frequent', label: '🔥 하루 10회 이상 (상시 활용)' },
                    { value: 'frequent', label: '⚡ 하루 5-9회 (매우 자주)' },
                    { value: 'regular', label: '📅 하루 1-4회 (자주)' },
                    { value: 'occasional', label: '🌤️ 주 3-4회 (가끔)' },
                    { value: 'rare', label: '🌙 주 1-2회 (간헐적)' },
                    { value: 'very_rare', label: '🔮 월 1-2회 (매우 가끔)' },
                    { value: 'never', label: '😴 거의 사용하지 않음' },
                ]
            }
        ]
    },
     {
        id: 'part4',
        title: 'PART 4. AI 역량 자가 진단',
        description: `각 항목은 AI를 효과적으로 활용하기 위한 핵심 역량을 의미합니다. 자신의 현재 역량 수준을 가장 잘 나타내는 점수에 솔직하게 응답해주세요. 이 결과는 교육 내용 개인화에 매우 중요하게 활용됩니다.

[점수 기준]
- ⭐ 1점 (입문): "AI? 들어는 봤는데..." AI 관련 용어나 도구가 아직은 낯설고, 직접 사용해 본 경험은 거의 없어요.
- ⭐⭐ 2점 (초보): "따라하면 할 수 있어요!" 가이드나 튜토리얼을 보면서 간단한 작업을 수행할 수 있어요. 기본적인 개념을 이해하기 시작했어요.
- ⭐⭐⭐ 3점 (활용): "이제 혼자서도 제법!" AI를 일상 업무에 자신감 있게 활용해요. 어떤 도구가 좋을지 스스로 판단하고, 원하는 결과물을 만들 수 있어요.
- ⭐⭐⭐⭐ 4점 (숙련): "제가 좀 알려드릴까요?" 동료들에게 AI 활용 노하우를 알려주거나, 복잡한 문제를 AI로 해결하는 방법을 찾아낼 수 있어요.
- ⭐⭐⭐⭐⭐ 5점 (선구자): "AI로 새로운 길을 만들어요." 기존에 없던 방식으로 AI를 활용하거나, 자신만의 워크플로우를 창조하며 다른 사람에게 영감을 줘요.`,
        questions: [
            { id: 'understanding', label: '🧠 이해 (Understand)', description: "AI의 기본 원리, 최신 기술 동향(e.g., LLM, 멀티모달), 비즈니스 적용 가능성과 함께 기술적 한계(e.g., 환각) 및 잠재적 리스크를 명확히 이해하고 설명하는 능력. (예시: \"RAG(검색 증강 생성)가 왜 필요한지, 기존 LLM의 한계와 어떻게 다른지 비유를 들어 설명할 수 있다.\")", type: 'rating', options: [1, 2, 3, 4, 5] },
            { id: 'application', label: '🛠️ 활용 (Use)', description: "자신의 구체적인 업무 목적(e.g., 보고서 작성, 교육 기획, 데이터 분석)에 가장 적합한 AI 도구를 선정하고, 페르소나, 컨텍스트, 제약조건을 포함한 효과적인 프롬프트를 작성하여 기대 이상의 결과물을 생성하며, 워크플로우를 자동화하는 능력. (예시: \"여러 개의 회의록 파일을 한 번에 분석하여 핵심 요약 및 액션 아이템을 자동으로 추출하는 프롬프트를 만들 수 있다.\")", type: 'rating', options: [1, 2, 3, 4, 5] },
            { id: 'criticalThinking', label: '🔍 비판적 사고 (Critical Thinking)', description: "AI가 생성한 결과물의 사실관계, 논리적 오류, 숨겨진 편향성, 윤리적 문제를 비판적으로 검토하고, 교차 검증을 통해 정보의 신뢰도를 판단하며, 결과물에 대한 최종 책임(Accountability)을 가지고 활용하는 능력. (예시: \"AI가 제안한 채용 면접 질문에서 특정 성별이나 연령대에 대한 편견이 포함될 가능성을 발견하고 이를 수정할 수 있다.\")", type: 'rating', options: [1, 2, 3, 4, 5] },
        ]
    },
    {
        id: 'part5',
        title: 'PART 5. 교육 기대사항',
        questions: [
            {
                id: 'expectations',
                label: '12. 교육에서 가장 기대하고 듣고 싶은 콘텐츠는? (최대 3개)',
                type: 'checkbox',
                options: [
                    { value: 'real_experience', label: '💡 (공통) 찐 HRD 실무자의 AI 활용 철학과 실전 노하우' },
                    { value: 'prompt_engineering', label: '⚡ (공통) 내 업무에 바로 쓰는 프롬프트 엔지니어링 실습' },
                    { value: 'security_strategy', label: '🔒 (공통) 보안 제약 환경에서의 현실적인 AI 활용 전략' },
                    { value: 'strategy_for_leaders', label: '🚀 (리더/기획자용) 팀/조직의 AI 도입 전략 및 구성원 역량 강화 방안' },
                    { value: 'automation_for_practitioners', label: '⚙️ (실무자용) 반복적인 HR 실무(채용,평가 등) 자동화 사례' },
                    { value: 'content_creation', label: '🎨 (교육/콘텐츠 담당자용) 교육 자료(이미지,영상) 제작 생산성 향상 노하우' },
                    { value: 'case_studies', label: '📊 (공통) 실제 HRD 프로젝트 AI 적용 성공/실패 사례 분석' },
                    { value: 'individual_solution', label: '🎯 (공통) 개별 현업 이슈에 대한 맞춤형 AI 솔루션 코칭' },
                ],
                maxSelection: 3
            },
            {
                id: 'personal_concerns',
                label: '13. 교육에서 개인적으로 꼭 해결하고 싶은 고민은? (최대 2개)',
                type: 'checkbox',
                options: [
                    { value: 'skill_improvement', label: '📚 AI 활용 역량을 체계적이고 효과적으로 향상시키는 방법' },
                    { value: 'resistance_management', label: '🛡️ 조직 내 AI 도입 저항감을 극복하고 확산시키는 방법' },
                    { value: 'security_balance', label: '⚖️ 보안정책과 업무 효율성 사이의 현실적 균형점 찾기' },
                    { value: 'quality_assessment', label: '🔍 AI 생성 결과물의 품질을 정확히 판단하고 개선하는 방법' },
                    { value: 'tool_selection_confusion', label: '🤔 AI 도구 선택 시 혼란과 의사결정의 어려움 해결' },
                    { value: 'value_creation', label: '💎 AI 시대에 HRD 전문가로서의 차별화된 가치 창출 방안' },
                    { value: 'no_concerns', label: '😊 특별한 고민 없음' },
                ],
                maxSelection: 2
            }
        ]
    },
     {
        id: 'part6',
        title: 'PART 6. 자유의견',
        questions: [
            {
                id: 'main_concern',
                label: '14. AI 활용과 관련하여 현재 가장 고민되는 이슈를 구체적으로 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: `예:
• 유료 AI는 회사에서 막혀있어요. 무료 AI만으로도 잘 쓸 수 있는 방법이 궁금해요.
• AI가 만든 자료, 저작권이나 보안 때문에 막상 쓰려니 불안해요.
• AI에 너무 의존하게 될까 봐 걱정돼요. 저의 생각하는 힘이 약해질까 봐요.`
            },
            {
                id: 'specific_request',
                label: '15. 본 교육과정에서 꼭 다뤄주셨으면 하는 부분이나 궁금한 점이 있다면 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: `예:
• 저희 팀이 쓰는 OOO툴(예: MS 코파일럿, Notion AI)을 HR 업무에 바로 써먹는 방법을 알려주세요.
• 반복적인 엑셀 작업이 너무 많아요. AI로 자동화하는 방법을 배우고 싶어요.
• AI로 보고서 초안을 빠르게 만들고 싶어요. 특히, 그래프 만드는 팁이 궁금해요.`
            },
             {
                id: 'personal_question',
                label: '16. 데미안 임정훈 강사에게 개인적으로 질문하고 싶은 내용이 있다면 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: `예:
• 요즘 AI 기술 중에 HR 담당자가 꼭 알아야 할 딱 한 가지만 꼽는다면 무엇인가요?
• 제 직무가 AI로 대체될까 봐 솔직히 불안해요. 어떤 준비를 해야 할까요?
• 강사님은 어떤 AI 서비스를 유료로 쓰시는지, 그리고 왜 그 툴을 선택하셨는지 궁금해요.`
            }
        ]
    }
] as const; // FIX: Add 'as const' to provide TypeScript with more specific types and prevent type inference issues.