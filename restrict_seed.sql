-- ===================================================
-- Cloudflare D1 입차제한 대상 17대 상태 초기 데이터 (처리완료 15, 미처리 2)
-- ===================================================

-- 1. 101버9300 (입주민 등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('101버9300', '입주민 등록', '상가차량. 등록 예정', 'sbyoob', '2026-06-04T12:00:00.000Z');

-- 2. 64무5902 (방문자등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('64무5902', '방문자등록', '203동1203호 어머니', 'sbyoob', '2026-08-04T12:00:00.000Z');

-- 3. 56나3443 (방문자등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('56나3443', '방문자등록', '방문자등록 이용', 'sbyoob', '2026-05-03T06:52:27.951Z');

-- 4. 27라4861 (입주민 등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('27라4861', '입주민 등록', '입주민 확인 완료', 'sbyoob', '2026-07-16T10:00:00.000Z');

-- 5. 25로2519 (방문자등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('25로2519', '방문자등록', '정기 방문 차량', 'sbyoob', '2026-06-05T11:00:00.000Z');

-- 6. 232호3306 (입주민 등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('232호3306', '입주민 등록', '입주민 차량 등록', 'sbyoob', '2026-05-10T09:00:00.000Z');

-- 7. 35어9765 (방문자등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('35어9765', '방문자등록', '방문증 발급', 'sbyoob', '2026-07-30T14:00:00.000Z');

-- 8. 830마2367 (입주민 등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('830마2367', '입주민 등록', '동호수 확인', 'sbyoob', '2026-05-12T15:00:00.000Z');

-- 9. 210러8883 (입차제한)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('210러8883', '입차제한', '경고 후 미등록 지속', 'sbyoob', '2026-08-17T16:00:00.000Z');

-- 10. 363라1927 (방문자등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('363라1927', '방문자등록', '방문자 등록', 'sbyoob', '2026-08-23T10:00:00.000Z');

-- 11. 274주4167 (입주민 등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('274주4167', '입주민 등록', '입주민 확인', 'sbyoob', '2026-08-03T11:00:00.000Z');

-- 12. 103구9150 (방문자등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('103구9150', '방문자등록', '방문 차량 등록', 'sbyoob', '2026-08-01T13:00:00.000Z');

-- 13. 205너3984 (입주민 등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('205너3984', '입주민 등록', '입주민 등록 완료', 'sbyoob', '2026-07-02T14:00:00.000Z');

-- 14. 32마7917 (방문자등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('32마7917', '방문자등록', '방문증 등록', 'sbyoob', '2026-07-19T10:00:00.000Z');

-- 15. 116허9001 (입주민 등록)
INSERT OR REPLACE INTO fac_restrict (plate, status, memo, updated_by, updated_at)
VALUES ('116허9001', '입주민 등록', '렌트카 입주민 등록', 'sbyoob', '2026-07-30T16:00:00.000Z');

-- 16. 09노3388 (미처리 - 미입력 상태 유지)
-- 17. 257고5193 (미처리 - 미입력 상태 유지)
