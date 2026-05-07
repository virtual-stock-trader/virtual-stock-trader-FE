# /feature — Ouroboros 연계 기능 개발

새 기능을 시작할 때 사용합니다.
Ouroboros의 명세 우선 철학을 Claude Code 워크플로우에 통합합니다.

---

## 실행 흐름

### 1단계: 명세 명확화 (Ouroboros Interview)

```
ooo interview "[기능 설명]"
```

소크라테스식 질문으로 숨겨진 가정을 드러냅니다.
Ambiguity 점수가 0.2 이하가 될 때까지 진행합니다.

---

### 2단계: 스펙 확정 (Ouroboros Seed)

```
ooo seed
```

Interview 결과를 확정된 스펙으로 정리합니다.

---

### 3단계: 브랜치 생성

스펙 확정 후:

```bash
git checkout -b feat/[기능명]
```

---

### 4단계: 구현 (Ouroboros Run)

```
ooo run
```

Double Diamond 구조로 구현을 진행합니다:

- Discovery → Definition → Design → Delivery

---

### 5단계: 검증 (Ouroboros Evaluate)

```
ooo evaluate
```

3단계 검증:

1. Mechanical — 타입, 린트, 빌드
2. Semantic — 의도한 대로 동작하는가?
3. Consensus — 다중 모델 합의

---

### 6단계: PR 생성

```
/pr
```

위 `/pr` 커맨드로 PR 초안 자동 생성.

---

## 막혔을 때

```
ooo unstuck
```

5가지 수평적 사고 페르소나(Contrarian, Hacker, Simplifier 등)를 활용합니다.
