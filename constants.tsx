import React from 'react';

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
                type: 'select',
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
                id: 'role', 
                label: '3. 주요 역할 및 직무를 선택해주세요', 
                type: 'select', 
                required: true,
                options: [
                    { value: 'hrd_planning_strategy', label: 'HRD (교육기획/전략)' },
                    { value: 'hrd_operation', label: 'HRD (교육운영/실무)' },
                    { value: 'hr_generalist', label: 'HR (인사기획/제도/채용/평가/보상)' },
                    { value: 'org_development_culture', label: '조직개발/조직문화' },
                    { value: 'leadership_coaching', label: '리더십개발/코칭/퍼실리테이션' },
                    { value: 'executive', label: '경영진/임원' },
                    { value: 'team_leader', label: '현업 리더/팀장' },
                    { value: 'external_expert', label: '외부 컨설턴트/강사/코치' },
                    { value: 'freelancer_one_person_company', label: '1인 기업/프리랜서' },
                    { value: 'other', label: '기타' },
                ] 
            },
            {
                id: 'company_size',
                label: '4. 소속 조직 규모는?',
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
                label: '5. 현재 직무(역할) 관련 총 경력은?',
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
                label: '6. 귀하 조직의 AI 사용 정책 수준은?',
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
                label: '7. 조직에서 공식적으로 허용/제공하는 AI 도구는? (복수선택)',
                type: 'checkbox',
                options: [
                    // Multimodal
                    { value: 'chatgpt_paid', label: '💎 ChatGPT (유료 버전/Plus/Team/Enterprise)' },
                    { value: 'claude_paid', label: '⭐ Claude (유료 버전/Pro/Team)' },
                    { value: 'gemini', label: '💫 Google Gemini (구 Bard)' },
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
                label: '8. 개인적으로 AI 도구를 처음 사용한 시기는?',
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
                label: '9. 현재 개인적으로 가장 자주 사용하는 AI 도구는? (최대 3개)',
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
                label: '10. 개인적인 AI 사용 빈도는?',
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
        description: '각 항목에 대해 자신의 현재 수준을 가장 잘 나타내는 점수를 선택해주세요.\n(1점: 전혀 그렇지 않다 / 2점: 거의 그렇지 않다 / 3점: 보통이다 / 4점: 어느 정도 그렇다 / 5점: 매우 그렇다)',
        questions: [
            { id: 'understanding', label: '🧠 이해 (Understand)', description: "AI의 기본 원리, 다양한 모델(e.g., LLM, 생성형 AI)의 작동 방식, 기술적 한계와 잠재적 리스크를 이해하는 능력. (예: '환각' 현상이 왜 발생하는지 설명할 수 있다.)", type: 'rating', options: [1, 2, 3, 4, 5] },
            { id: 'application', label: '🛠️ 활용 (Use)', description: "자신의 업무 목적에 맞는 AI 도구를 선택하고, 효과적인 프롬프트를 작성하여 원하는 결과물을 생성하며, 반복적인 업무를 자동화하는 능력. (예: 보고서 초안 작성, 데이터 요약, 이미지 생성 등을 AI로 처리할 수 있다.)", type: 'rating', options: [1, 2, 3, 4, 5] },
            { id: 'criticalThinking', label: '🔍 비판적 사고 (Critical Thinking)', description: "AI가 생성한 결과물의 사실관계, 편향성, 윤리적 문제를 비판적으로 검토하고, 정보의 신뢰도를 판단하며, 책임감 있게 활용하는 능력. (예: AI가 만든 통계자료의 출처를 확인하고 교차 검증할 수 있다.)", type: 'rating', options: [1, 2, 3, 4, 5] },
        ]
    },
    {
        id: 'part5',
        title: 'PART 5. 교육 기대사항',
        questions: [
            {
                id: 'expectations',
                label: '11. 교육에서 가장 기대하고 듣고 싶은 콘텐츠는? (최대 3개)',
                type: 'checkbox',
                options: [
                    { value: 'real_experience', label: '💡 찐 HRD 실무자의 AI 활용 철학과 실전 노하우' },
                    { value: 'prompt_engineering', label: '⚡ HRD 업무별 맞춤형 프롬프트 엔지니어링 기법' },
                    { value: 'security_strategy', label: '🔒 보안 제약 환경에서의 현실적이고 안전한 AI 활용 전략' },
                    { value: 'tool_selection', label: '🛠️ AI 도구별 특징 비교와 업무 목적별 선택 가이드' },
                    { value: 'case_studies', label: '📊 실제 HRD 프로젝트 AI 적용 성공/실패 사례 분석' },
                    { value: 'ethics_guide', label: '⚖️ AI 윤리 및 책임감 있는 활용을 위한 실무 가이드라인' },
                    { value: 'individual_solution', label: '🎯 개별 현업 이슈에 대한 맞춤형 AI 솔루션 제안' },
                    { value: 'networking', label: '🤝 참가자 간 AI 활용 경험 공유 및 네트워킹 시간' },
                ],
                maxSelection: 3
            },
            {
                id: 'personal_concerns',
                label: '12. 교육에서 개인적으로 꼭 해결하고 싶은 고민은? (최대 2개)',
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
                label: '13. AI 활용과 관련하여 현재 가장 고민되는 이슈를 구체적으로 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: '예:\n• 생성형 AI가 만든 결과물의 저작권 이슈가 걱정됩니다. 어디까지 업무에 활용해도 안전한가요?\n• AI를 쓰면 쓸수록 오히려 생각하는 능력이 퇴화하는 것 같아 고민입니다.\n• 저희 팀은 AI 활용에 대한 관심이 너무 낮습니다. 어떻게 해야 동기부여를 할 수 있을까요?'
            },
            {
                id: 'specific_request',
                label: '14. 본 교육과정에서 꼭 다뤄주셨으면 하는 부분이나 궁금한 점이 있다면 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: '예:\n• M365 코파일럿을 조직에 도입했는데, 실제 업무에서 MS 팀즈, 엑셀, 파워포인트와 연계하여 생산성을 높이는 구체적인 시나리오를 많이 보여주세요.\n• 비개발자 HR 담당자가 노코드(No-code) 툴과 AI를 결합하여 간단한 업무 자동화 시스템을 만드는 방법을 배우고 싶습니다.\n• 리더십 코칭이나 성과 피드백 상황에서 AI를 활용할 수 있는 윤리적이고 효과적인 방법이 궁금합니다.'
            },
             {
                id: 'personal_question',
                label: '15. 데미안 임정훈 강사에게 개인적으로 질문하고 싶은 내용이 있다면 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: '예:\n• AI 기술이 빠르게 발전하는데, 어떤 정보를 기준으로 계속 학습해야 할지 막막합니다. 강사님만의 학습 비결이 궁금합니다.\n• AI 때문에 내 직무가 사라질까 불안한 마음이 듭니다. HR 전문가로서 어떻게 커리어를 개발해야 할까요?\n• 수많은 AI 뉴스 중에서 \'진짜\'와 \'과장\'을 구분하는 강사님만의 노하우는 무엇인가요?'
            }
        ]
    }
] as const; // FIX: Add 'as const' to provide TypeScript with more specific types and prevent type inference issues.