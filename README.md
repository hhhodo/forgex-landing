# FORGEX — 산업·제조 스마트 매뉴팩처링 랜딩페이지

**Live: https://hhhodo.github.io/forgex-landing/**

산업·제조(스마트 매뉴팩처링) 주제의 원페이지 랜딩입니다. 브랜드명(FORGEX)은 영어, 본문 콘텐츠는 한글로
작성했으며, 모든 이미지 슬롯은 실사진 대신 `#d9d9d9`(디자인 키트 `--color-placeholder` 그대로) 플레이스홀더로
처리했습니다.

## 레퍼런스 취득 경로

이번 세션에서는 Figma MCP(`get_design_context`)가 인증되지 않아 사용할 수 없었습니다(로그인 필요).
치트시트의 레퍼런스 우선순위(① Figma MCP → ② Screenshot → ③ Website → ④ 기본값)에 따라, 사용자가 첨부한
**레퍼런스 스크린샷**(피트니스/뱅킹 원페이지 목업)을 2순위 레퍼런스로 실측·분석해 그리드·비율·구성을
그대로 이식하고, 브랜드명·카피·업종 이미지만 산업·제조 테마로 교체했습니다.

| 항목 | 스크린샷 관찰값 | 판정 |
|---|---|---|
| 히어로 구성 | 좌측 대형 패널(약 2/3) + 우측 2단 스택(작은 카드 + 솔리드 다크 카드) | `8-4` 스플릿 |
| 파트너 섹션 | 좌측 텍스트+썸네일, 우측 세로 이미지 스택 5장 | `5-7` 스플릿 |
| 원형 카드 로우 | 원형 이미지 + 캡션, 짝수 카드 하단 오프셋 | `3-3-3-3`(치트시트 카드 규칙에 맞춰 5장→4장으로 조정) |
| 다크 솔루션 섹션 | 좌우 교차 배치, 원형 다이어그램 그래픽 | `6-6 × 4행 alternating` |
| 버튼 | 알약형 솔리드 + 아웃라인, 화살표 아이콘 없음 | `button-radius=round`, `button-style=solid+outline` |
| 이미지 코너 | 카드·이미지 전반 둥근 모서리 | `image-radius=soft`, `card-radius=soft` |
| 색상 | 그레이스케일 + 대형 다크(블랙) 블록이 화면을 지배 | `color=dominant`(브랜드 컬러 없이 디자인 키트 그레이스케일 토큰만 사용) |

카드 캐러셀처럼 보이는 점(닷 인디케이터)과 화살표 버튼은 치트시트 Hard Rules(캐러셀/슬라이더/화살표 금지)에
따라 전부 제거했습니다.

## Variant

```
variant: typo=medium / image=high / color=dominant / image-radius=soft /
         card-radius=soft / button-radius=round / border=hairline /
         button-style=solid+outline / fw=700/400 / spacing=space-11
```

| 축 | 값 | 근거 |
|---|---|---|
| 타이포그래피 태도 | `medium` | 히어로 타이틀이 화면을 압도하지 않는 `h0`(64px) 스케일, 2줄 헤드라인 |
| 이미지 비중 | `high` | 히어로 비주얼 + 파트너 스택 5장 + 원형 카드 4장 + 후기 카드 4장 |
| 컬러 | `dominant` | Capabilities/CTA/Footer 3개 섹션이 `--color-primary-900` 블랙 블록으로 화면을 지배 |

## 레이아웃 — 그리드 값

```
Header       — full-bleed (sticky nav)
Hero         — full-bleed — 8-4 (우측 4는 2단 스택, 우측 컬럼 space-8만큼 상단 오프셋)
Partner      — 5-7 (좌: 텍스트+썸네일 4장 / 우: 세로 스택 이미지 5장)
Showcase     — 3-3-3-3 (원형 산업분야 카드, 2·4번째 카드 하단 오프셋)
Capabilities — full-bleed, dark — 6-6 × 4행 (행마다 좌우 교차: 그래픽↔텍스트)
Reviews      — 3-3-3-3 (도입 후기 카드)
CTA          — full-bleed, dark
Footer       — full-bleed — 4-8 (우측 3열 중 CONTACT 컬럼만 상단 오프셋)
```

동일한 스플릿이 연속 섹션에서 반복되지 않도록 배치했습니다(예: Showcase와 Reviews 모두 `3-3-3-3`이지만
사이에 `6-6` Capabilities 섹션을 배치).

## 반응형

- `≤1024px`: 모든 그리드 스플릿이 단일 컬럼으로 스택, 오프셋 마진 제거, Capabilities 각 행은 그래픽이
  텍스트 위로 오도록 순서 반전.
- `≤768px`: 네비게이션이 햄버거 토글 메뉴로 전환.

## 기술 스택

Pretendard 기반 디자인 키트(`css/styles.css`, 수정하지 않음) + 컴포넌트 전용 `css/site.css`. 별도 프레임워크
없이 시맨틱 HTML + Vanilla JS(스크롤 리빌, 모바일 내비 토글)로만 구성했습니다.

## 배포

GitHub Pages(GitHub Actions) 자동 배포. `main` 브랜치 푸시 시 `.github/workflows/deploy.yml`이 실행됩니다.
