# /review — 코드 리뷰 자동화

## 실행 흐름

아래 순서로 현재 브랜치의 변경사항을 분석합니다.

---

## Step 1. 변경사항 수집

```bash
git diff main...HEAD
git diff --staged
```

staged와 unstaged 변경사항을 모두 확인합니다.

---

## Step 2. 컨텍스트 파악

- 어떤 파일이 변경되었는가?
- 변경의 목적이 무엇인가? (feat / fix / refactor 등)
- 연관된 컴포넌트나 모듈이 있는가?

---

## Step 3. 리뷰 기준 (CLAUDE.md 기반)

### 필수 검사

1. **TypeScript 안전성** — `any` 사용, 타입 누락, 불안전한 캐스팅
2. **Next.js 패턴** — Server/Client Component 혼용, cache 옵션 누락
3. **React 패턴** — 불필요한 re-render, useEffect 남용, key prop 누락
4. **보안** — 환경 변수 노출, XSS 취약점, 불필요한 권한
5. **코드 품질** — 중복 코드, 과도한 complexity, 불명확한 네이밍

### 선택 검사

6. **성능** — 불필요한 번들 크기, 이미지 최적화, lazy loading 기회
7. **접근성** — aria 속성, 키보드 네비게이션, 시맨틱 HTML

---

## Step 4. 리뷰 출력 형식

아래 형식으로 리뷰를 작성합니다:

```
## 코드 리뷰

### 요약
[변경사항 한 줄 요약]

### 🔴 필수 수정 (Blocking)
- [파일명:라인] 문제 설명 → 수정 방향

### 🟡 권장 수정 (Non-blocking)
- [파일명:라인] 문제 설명 → 수정 방향

### 🟢 잘된 점
- [잘 작성된 부분 언급]

### 💡 개선 제안
- [선택적 개선 아이디어]
```

---

## Step 5. ooo evaluate 연계 (선택)

기능 구현 관련 변경이라면:

```
ooo evaluate
```

를 추가로 실행해 Ouroboros 3단계 검증(Mechanical → Semantic → Consensus)을 수행합니다.
