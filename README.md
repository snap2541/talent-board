# 달란트 트래커 ✨

## 시작하기

### 1. 의존성 설치 (최초 1회)

```bash
# 루트
npm install

# 서버
cd server && npm install

# 클라이언트
cd ../client && npm install
```

### 2. 실행

프로젝트 루트에서:

```bash
npm run dev
```

- 서버: http://localhost:3001
- 클라이언트: http://localhost:5173

### 3. 첫 실행 순서

1. 브라우저에서 **http://localhost:5173/admin** 접속
2. 두 사용자의 QR 코드를 인쇄 또는 화면 캡처
3. **/scan** 페이지에서 QR 스캔 → 달란트 추가
4. **/board** 페이지에서 진척도 확인

## 화면 구성

| 경로 | 설명 |
|------|------|
| `/board` | 뱀 경로 진척도 보드 (메인 화면) |
| `/scan` | QR 스캔 → 달란트 입력 |
| `/admin` | QR 코드 출력 및 관리 |

## 캐릭터 이미지 교체

`client/public/images/` 폴더에 이미지 파일을 넣고
`client/src/config/characters.js`에서 파일명을 수정하세요.

```
client/public/images/
  sophie/
    sophie_lv1.png  ← 0점 이상
    sophie_lv2.png  ← 10점 이상
    sophie_lv3.png  ← 20점 이상
    sophie_lv4.png  ← 30점 이상
    sophie_token.png (보드 토큰용 작은 이미지)
  cinnamoroll/
    cinna_lv1.png
    cinna_lv2.png
    cinna_lv3.png
    cinna_lv4.png
    cinna_token.png
```

이미지가 없으면 이모지 플레이스홀더로 표시됩니다.

## 효과음 추가

`client/public/sounds/` 폴더에 아래 파일을 넣으세요:
- `coin.mp3` — 달란트 추가 시 효과음
- `levelup.mp3` — 레벨업 팡파르
- `scan.mp3` — QR 스캔 성공음

## 데이터 초기화

서버를 중지한 후 `server/data/talent.db` 파일을 삭제하면 초기화됩니다.

## 웹 배포

```bash
# 클라이언트 빌드
cd client && npm run build

# 서버 환경변수 설정
NODE_ENV=production PORT=3000 node server/index.js
```

클라이언트 `VITE_API_URL` 환경변수로 API 서버 URL을 지정할 수 있습니다.
