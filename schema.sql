-- ===================================================
-- Cloudflare D1 Database Schema
-- Project: Apartment Parking Management System (ARLGPM)
-- ===================================================

-- 1. 적발 기록 테이블
CREATE TABLE IF NOT EXISTS fac_records (
    id TEXT PRIMARY KEY,
    plate TEXT NOT NULL,
    date TEXT NOT NULL,
    staff TEXT,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 빠른 검색 및 월별 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_records_plate ON fac_records(plate);
CREATE INDEX IF NOT EXISTS idx_records_date ON fac_records(date DESC);

-- 2. 담당자 목록 테이블
CREATE TABLE IF NOT EXISTS fac_managers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 3. 입차제한 대상 차량 상태 관리 테이블
CREATE TABLE IF NOT EXISTS fac_restrict (
    plate TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    memo TEXT,
    updated_by TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 4. 관리자 계정 테이블 (Web Crypto SHA-256 + Salt)
CREATE TABLE IF NOT EXISTS admin_users (
    email TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);
