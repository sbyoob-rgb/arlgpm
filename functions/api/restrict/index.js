import { jsonResponse, errorResponse } from '../_utils.js';

// GET /api/restrict
export async function onRequestGet({ env }) {
  try {
    // memo, updated_by 컬럼이 없을 경우를 대비해 안전하게 조회
    try {
      const { results } = await env.DB.prepare(
        'SELECT plate, status, memo, updated_by, updated_at FROM fac_restrict'
      ).all();
      return jsonResponse(results || []);
    } catch (e) {
      // 컬럼 추가 전 fallback
      const { results } = await env.DB.prepare(
        'SELECT plate, status, updated_at FROM fac_restrict'
      ).all();
      return jsonResponse((results || []).map(r => ({ ...r, memo: '', updated_by: '' })));
    }
  } catch (e) {
    return errorResponse('입차제한 목록 조회 실패: ' + e.message, 500);
  }
}

// POST /api/restrict (상태 & 메모 Upsert)
export async function onRequestPost({ request, env }) {
  try {
    const { plate, status, memo, updated_by } = await request.json();
    if (!plate || !status) {
      return errorResponse('차량번호와 상태값은 필수입니다.');
    }

    const cleanPlate = plate.trim().toUpperCase();
    const cleanStatus = status.trim();
    const cleanMemo = (memo || '').trim();
    const cleanUpdatedBy = (updated_by || '').trim();
    const updatedAt = new Date().toISOString();

    // 테이블 컬럼이 존재하는지 안전하게 처리
    try {
      await env.DB.prepare(
        'INSERT INTO fac_restrict (plate, status, memo, updated_by, updated_at) VALUES (?, ?, ?, ?, ?) ' +
        'ON CONFLICT(plate) DO UPDATE SET status = excluded.status, memo = excluded.memo, updated_by = excluded.updated_by, updated_at = excluded.updated_at'
      ).bind(cleanPlate, cleanStatus, cleanMemo, cleanUpdatedBy, updatedAt).run();
    } catch (e) {
      // memo, updated_by 컬럼이 없는 기존 테이블 대비
      try {
        await env.DB.prepare('ALTER TABLE fac_restrict ADD COLUMN memo TEXT').run();
        await env.DB.prepare('ALTER TABLE fac_restrict ADD COLUMN updated_by TEXT').run();
        await env.DB.prepare(
          'INSERT INTO fac_restrict (plate, status, memo, updated_by, updated_at) VALUES (?, ?, ?, ?, ?) ' +
          'ON CONFLICT(plate) DO UPDATE SET status = excluded.status, memo = excluded.memo, updated_by = excluded.updated_by, updated_at = excluded.updated_at'
        ).bind(cleanPlate, cleanStatus, cleanMemo, cleanUpdatedBy, updatedAt).run();
      } catch (alterErr) {
        await env.DB.prepare(
          'INSERT INTO fac_restrict (plate, status, updated_at) VALUES (?, ?, ?) ' +
          'ON CONFLICT(plate) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at'
        ).bind(cleanPlate, cleanStatus, updatedAt).run();
      }
    }

    return jsonResponse({ plate: cleanPlate, status: cleanStatus, memo: cleanMemo, updated_by: cleanUpdatedBy, updated_at: updatedAt });
  } catch (e) {
    return errorResponse('입차제한 상태 변경 실패: ' + e.message, 500);
  }
}
