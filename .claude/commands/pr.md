# /pr — PR 자동 생성

## 실행 흐름

현재 브랜치 기준으로 PR 제목과 본문을 생성합니다.

---

## Step 1. 변경사항 분석

```bash
git log main...HEAD --oneline
git diff main...HEAD --stat
git diff main...HEAD
```

커밋 히스토리와 실제 변경 파일을 모두 확인합니다.

---

## Step 2. PR 메타데이터 결정

브랜치명과 커밋 메시지를 분석해:

- **PR 타입**: feat / fix / refactor / chore / docs / test
- **영향 범위**: 어떤 페이지/컴포넌트/API가 영향받는가?
- **Breaking Change**: 기존 동작을 변경하는가?

---

## Step 3. PR 초안 생성

아래 템플릿으로 PR 본문을 작성합니다:

```markdown
## 개요

[변경의 목적과 배경을 2-3문장으로 설명]

## 변경사항

- [구체적인 변경 항목 1]
- [구체적인 변경 항목 2]

## 스크린샷 / 데모

<!-- UI 변경이 있다면 스크린샷 첨부 -->

## 테스트 방법

1. [테스트 시나리오 1]
2. [테스트 시나리오 2]

## 체크리스트

- [ ] TypeScript 에러 없음 (`npx tsc --noEmit`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 테스트 작성/업데이트
- [ ] 환경 변수 변경사항 `.env.example` 반영
- [ ] Breaking change 여부 확인

## 관련 이슈

closes #[이슈번호]
```

---

## Step 4. 품질 사전 검사

PR 생성 전 실행:

```bash
npx tsc --noEmit
npm run lint
```

에러가 있으면 먼저 알립니다.

---

## Step 5. gh CLI로 PR 생성

초안 확인 후 실제 생성:

```bash
gh pr create \
  --title "[타입]: [제목]" \
  --body "[생성된 본문]" \
  --base develop \
  --draft
```

> 기본은 `--draft`로 생성합니다. 리뷰 준비가 되면 `gh pr ready`로 전환하세요.
