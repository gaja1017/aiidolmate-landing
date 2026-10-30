# AI Idol Mate - Landing Page

> aiidolmate.kr 랜딩페이지

## 배포 구조

```
aiidolmate.kr          → 랜딩페이지 (이 레포)
app.aiidolmate.kr      → 채팅 서비스 (ai-idol-mate 레포)
```

## 개발

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드 (소스 암호화)
npm run build
```

## 배포 (Vercel)

### 1단계: GitHub 레포 생성 및 푸시

```bash
cd /Users/im-yeongjae/Documents/IDOL/aiidolmate-landing

# Git 초기화
git init
git add -A
git commit -m "Initial commit: AI Idol Mate Landing"

# GitHub 레포 생성 후
git remote add origin https://github.com/YOUR_USERNAME/aiidolmate-landing.git
git push -u origin main
```

### 2단계: Vercel 배포

1. [Vercel](https://vercel.com) → New Project
2. Import `aiidolmate-landing` repository
3. Deploy (자동 빌드)

### 3단계: 도메인 연결

**Vercel Dashboard → Project → Settings → Domains**

1. `aiidolmate.kr` 추가
2. DNS 설정 (가비아):

| 타입 | 호스트 | 값 |
|------|--------|-----|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

## 보안 기능

- ✅ HTML/CSS 압축 (minify)
- ✅ JavaScript 난독화 (obfuscation)
- ✅ 우클릭 비활성화
- ✅ 개발자 도구 감지 및 차단
- ✅ F12, Ctrl+U 비활성화
- ✅ CSP (Content Security Policy) 헤더
- ✅ X-Frame-Options DENY

## 파일 구조

```
aiidolmate-landing/
├── src/
│   └── index.html      # 원본 HTML (Git에 포함)
├── public/
│   └── index.html      # 암호화된 빌드 결과 (Git 제외)
├── scripts/
│   └── build.js        # 빌드 스크립트
├── vercel.json         # Vercel 설정
└── package.json
```
