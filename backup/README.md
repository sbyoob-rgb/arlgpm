# ARLGPM 원본 데이터 백업 및 D1 마이그레이션 안내

이 폴더는 Supabase에서 무손실로 추출된 100% 원본 백업 데이터입니다.

## 백업 파일 목록
- `fac_records.json`: 적발 기록 전체 502건 (차량번호, 적발일자, 담당자, 연락처 등)
- `fac_managers.json`: 등록된 담당자 목록 6명
- `fac_restrict.json`: 입차제한 대상 차량 처리 상태

## Cloudflare D1 데이터베이스 적재 방법 (배포 시 1회 실행)

Cloudflare 대시보드 또는 Wrangler CLI를 통해 아래 명령어를 실행하면 D1에 즉시 데이터가 복원/적재됩니다.

```bash
# 1. D1 데이터베이스 생성 (CLI 사용 시)
npx wrangler d1 create arlgpm-db

# 2. 스키마 생성
npx wrangler d1 execute arlgpm-db --file=./schema.sql --remote

# 3. 백업 데이터 502건+ 일괄 적재
npx wrangler d1 execute arlgpm-db --file=./seed_data.sql --remote
```
