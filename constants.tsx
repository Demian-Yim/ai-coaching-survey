import React from 'react';

export const SURVEY_QUESTIONS = [
    {
        id: 'user_info',
        title: 'PART 1. 기본정보',
        questions: [
            { id: 'user_details', label: '0. 응답자 정보를 입력해주세요. (결과 확인 및 분석용)', type: 'multi-text', required: true, fields: [
                { id: 'name', placeholder: '이름 (예: 홍길동)' },
                { id: 'company', placeholder: '회사명 (예: 구루피플스)' },
                { id: 'position', placeholder: '직책 (예: 책임, 선임)' },
            ]},
            { id: 'laptop_type', label: '1. 실무에 사용하시는 노트북 종류와 연식을 알려주세요.', description: '예: 맥북에어 M2 (2022년), LG그램 15 (2021년)', type: 'text', required: true, placeholder: '노트북 종류 및 연식 입력' },
            { 
                id: 'role', 
                label: '2. 주요 역할 및 직무를 선택해주세요', 
                type: 'radio', 
                options: [
                    { value: 'hrd_manager', label: '👑 HRD담당자 (팀장급)' },
                    { value: 'hrd_staff', label: '💼 HRD담당자 (실무자급)' },
                    { value: 'hr_recruit', label: '🎯 인사담당자 (채용/평가)' },
                    { value: 'hr_policy', label: '📋 인사담당자 (제도/기획)' },
                    { value: 'ld_expert', label: '🎓 L&D 전문가' },
                    { value: 'od_specialist', label: '🏗️ 조직개발 담당자' },
                    { value: 'coach_internal', label: '🎨 코치·퍼실리테이터 (사내)' },
                    { value: 'coach_external', label: '🌟 코치·퍼실리테이터 (외부)' },
                    { value: 'consultant', label: '💡 컨설턴트/프리랜서' },
                    { value: 'executive', label: '🎖️ 경영진/임원' },
                    { value: 'other', label: '✏️ 기타', hasTextInput: true },
                ] 
            },
            {
                id: 'company_size',
                label: '3. 소속 조직 규모는?',
                type: 'radio',
                options: [
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
                label: '4. HRD/인사 관련 업무 경력은?',
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
                label: '5. 귀하 조직의 AI 사용 정책 수준은?',
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
                label: '6. 조직에서 공식적으로 허용/제공하는 AI 도구는? (복수선택)',
                type: 'checkbox',
                options: [
                    { value: 'chatgpt_free', label: '🤖 ChatGPT (무료 버전)' },
                    { value: 'chatgpt_paid', label: '💎 ChatGPT (유료 버전/Plus/Team/Enterprise)' },
                    { value: 'claude_free', label: '🎭 Claude (무료 버전)' },
                    { value: 'claude_paid', label: '⭐ Claude (유료 버전/Pro/Team)' },
                    { value: 'gemini', label: '💫 Google Gemini (구 Bard)' },
                    { value: 'copilot_m365', label: '🏢 Microsoft Copilot (Office 365/M365)' },
                    { value: 'wrtn', label: '🇰🇷 뤼튼 (Wrtn)' },
                    { value: 'hyperclova', label: '🔥 네이버 하이퍼클로바X' },
                    { value: 'internal_ai', label: '🛠️ 사내 자체 개발 AI 플랫폼' },
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
                label: '7. 개인적으로 AI 도구를 처음 사용한 시기는?',
                type: 'radio',
                options: [
                    { value: 'before_2022', label: '🦕 2021년 이전 (GPT-3 이전 시대)' },
                    { value: '2022', label: '🌅 2022년 (GPT-3 시대)' },
                    { value: 'early_2023', label: '🔥 2023년 초반 (ChatGPT 초기 열풍)' },
                    { value: 'mid_2023', label: '📈 2023년 중반' },
                    { value: 'late_2023', label: '🍂 2023년 하반기' },
                    { value: '2024_after', label: '⭐ 2024년 이후' },
                    { value: 'never', label: '🤔 아직 사용해본 적 없음' },
                ]
            },
            {
                id: 'frequently_used',
                label: '8. 현재 개인적으로 가장 자주 사용하는 AI 도구는? (최대 3개)',
                type: 'checkbox',
                options: [
                    { value: 'chatgpt', label: '🤖 ChatGPT' },
                    { value: 'claude', label: '🎭 Claude' },
                    { value: 'gemini', label: '💫 Google Gemini' },
                    { value: 'copilot', label: '🏢 Microsoft Copilot' },
                    { value: 'wrtn', label: '🇰🇷 뤼튼 (Wrtn)' },
                    { value: 'notion_ai', label: '📝 Notion AI' },
                    { value: 'perplexity', label: '🔍 Perplexity AI' },
                    { value: 'none', label: '❌ 특별히 자주 쓰는 도구 없음' },
                ],
                maxSelection: 3
            },
            {
                id: 'usage_frequency',
                label: '9. 개인적인 AI 사용 빈도는?',
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
        description: 'AI 리터러시 구성요소별 현재 수준을 평가해주세요 (1점=매우 부족, 5점=매우 우수)',
        questions: [
            { id: 'understanding', label: '🧠 이해 (Understand)', description: 'AI 원리, 작동방식, 장단점과 한계 이해', type: 'rating', options: [1, 2, 3, 4, 5] },
            { id: 'application', label: '🛠️ 활용 (Use)', description: '다양한 AI 도구의 능숙하고 효율적인 사용', type: 'rating', options: [1, 2, 3, 4, 5] },
            { id: 'criticalThinking', label: '🔍 비판적 사고 (Critical Thinking)', description: '결과물의 신뢰성, 윤리성, 적절성 판단', type: 'rating', options: [1, 2, 3, 4, 5] },
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
                placeholder: '예:\n• AI를 활용해도 기대만큼 업무 효율이 오르지 않는 이유와 개선방안이 궁금합니다\n• 보안 제약이 많은 환경에서 효과적으로 AI를 활용하는 구체적 방법을 알고 싶습니다\n• 팀원들의 AI 활용 저항감을 해결하고 조직 차원의 도입을 성공시키는 방법이 고민됩니다'
            },
            {
                id: 'specific_request',
                label: '14. 본 교육과정에서 꼭 다뤄주셨으면 하는 부분이나 궁금한 점이 있다면 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: '예:\n• 개인별 맞춤 학습경로를 AI로 설계하는 구체적인 방법과 도구\n• 교육 효과성 측정과 ROI 산출을 AI로 자동화하는 실무 적용법\n• 소규모 조직에서 예산 제약 하에 AI를 도입하는 현실적 전략'
            },
             {
                id: 'personal_question',
                label: '15. 데미안 임정훈 강사에게 개인적으로 질문하고 싶은 내용이 있다면 적어주세요 (선택사항)',
                type: 'textarea',
                placeholder: '예:\n• HRD 실무자로서 AI 활용 여정에서 가장 큰 깨달음이나 실패 경험은?\n• AI 시대에 HRD 전문가가 갖춰야 할 가장 중요한 마인드셋은?\n• 보안이 엄격한 대기업에서 AI를 활용하는 노하우는?'
            }
        ]
    }
];