import { jsonResponse, errorResponse } from '../_utils.js';

// GET /api/restrict
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT plate, status, updated_at FROM fac_restrict'
    ).all();
    return jsonResponse(results || []);
  } catch (e) {
    return errorResponse('입차제한 목록 조회 실패: ' + e.message, 500);
  }
}

// POST /api/restrict (상태 Upsert)
export async function onRequestPost({ request, env }) {
  try {
    const { plate, status } = await request.json();
    if (!plate || !status) {
      return errorResponse('차량번호와 상태값은 필수입니다.');
    }

    const cleanPlate = plate.trim().toUpperCase();
    const cleanStatus = status.trim();
    const updatedAt = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO fac_restrict (plate, status, updated_at) VALUES (?, ?, ?) ' +
      'ON CONFLICT(plate) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at'
    ).bind(cleanPlate, cleanStatus, updatedAt).run();

    return jsonResponse({ plate: cleanPlate, status: cleanStatus, updated_at: updatedAt });
  } catch (e) {
    return errorResponse('입차제한 상태 변경 실패: ' + e.message, 500);
  }
}
