# CLAUDE.md — 개발 규칙 엔진

> 이 파일은 Claude Code가 항상 먼저 읽는 프로젝트 헌법입니다.

> Ouroboros(`ooo`) 명령어와 함께 사용됩니다.

---

## 프로젝트 개요

- **스택**: Vite + React, TypeScript
- **패키지 매니저**: npm
- **스타일**: Tailwind CSS
- **AI 플러그인**: Ouroboros (`ooo`) — 명세 우선 개발 시스템

---

## 코드 스타일 규칙

### 언어 & 타입

- 모든 코드는 **TypeScript strict 모드** 기준 작성
- `any` 타입 사용 금지 — `unknown` 또는 제네릭 사용
- 타입 정의는 `interface` 대신 `type` 사용 — `type User = { ... }`
- 타입명은 PascalCase

### Vite 규칙

- 환경 변수는 `VITE_*` prefix 필수 — 클라이언트에서 `import.meta.env.VITE_*`로 접근
- 절대경로 alias는 `vite.config.ts`의 `resolve.alias`에서 관리 (`@/` → `src/`)
- 동적 import(`import()`)로 코드 스플리팅 적극 활용

### React 규칙

- 컴포넌트 파일명: PascalCase (`UserCard.tsx`)
- Hook 파일명: camelCase with `use` prefix (`useUserData.ts`)
- Props 타입은 파일 상단에 `type Props = { ... }` 형태로 선언
- 불필요한 `useEffect` 지양 — 데이터 페칭은 React Query / SWR 우선 검토
- `useEffect` 의존성 배열 누락 금지

### 파일 구조

```
src/
  components/
    ui/           # 재사용 순수 UI 컴포넌트
    features/     # 도메인 특화 컴포넌트
  hooks/          # 커스텀 훅
  pages/          # 라우트 페이지 컴포넌트
  lib/
    api/          # API 클라이언트
    utils/        # 유틸 함수
  types/          # 공유 타입 정의
  assets/         # 이미지, 폰트 등 정적 파일
```

---

## Git 규칙

### 커밋 메시지 (Conventional Commits)

```
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
chore: 설정/의존성
docs: 문서
test: 테스트
```

### 브랜치 전략

- `main` — 프로덕션
- `develop` — 통합
- `chore/init` — 프로젝트 초기 틀 세팅 (현재 브랜치)
- `feat/기능명`, `fix/이슈명`, `chore/작업명` — 작업 브랜치

---

## Ouroboros 통합 워크플로우

### 새 기능 개발 시 (필수)

```
1. ooo interview "구현할 기능 설명"   # 명세 명확화
2. ooo seed                           # 스펙 확정
3. ooo run                            # 구현
4. ooo evaluate                       # 검증
```

### PR 생성 시

```
1. /pr    # PR 초안 자동 생성 (Claude Code 명령어)
2. gh pr create 로 실제 생성
```

### 코드 리뷰 시

```
/review   # 변경사항 분석 + 개선안 제시
```

---

## 금지사항

- `console.log` 커밋 금지 (debug 시 `console.error` or logger 사용)
- `.env` 파일 커밋 절대 금지
- `rm -rf` 명령어 실행 금지
- `node_modules` 직접 수정 금지
- 테스트 없이 `main` 직접 푸시 금지

---

## PR 체크리스트 (자동 검사 항목)

Claude가 `/pr` 실행 시 아래를 확인합니다:

- [ ] TypeScript 에러 없음 (`npx tsc --noEmit`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 테스트 통과 (`npm test`)
- [ ] 불필요한 `console.log` 없음
- [ ] `VITE_*` 아닌 환경 변수 클라이언트 노출 없음
- [ ] 빌드 성공 확인 (`npm run build`)
- [ ] PR 설명에 변경 이유 포함
