import { jsonResponse, errorResponse, requireAuth } from '../_utils.js';

// GET /api/records
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, plate, date, staff, note, created_at FROM fac_records ORDER BY date DESC, created_at DESC'
    ).all();
    return jsonResponse(results || []);
  } catch (e) {
    return errorResponse('기록 조회 실패: ' + e.message, 500);
  }
}

// POST /api/records (단건 또는 다건 추가)
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    
    // 다건 추가 (배열)
    if (Array.isArray(body)) {
      // 엑셀 일괄 업로드 등
      if (body.length === 0) return jsonResponse([]);
      
      const stmts = body.map(r => {
        const id = r.id || crypto.randomUUID();
        const plate = (r.plate || '').trim().toUpperCase();
        const date = r.date || new Date().toISOString().slice(0, 10);
        const staff = r.staff || '';
        const note = r.note || '';
        return env.DB.prepare(
          'INSERT INTO fac_records (id, plate, date, staff, note) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, plate, date, staff, note);
      });
      
      // D1 Batch 실행
      await env.DB.batch(stmts);
      return jsonResponse({ success: true, count: body.length });
    }

    // 단건 추가
    const { plate, date, staff, note } = body;
    if (!plate || !date) {
      return errorResponse('차량번호와 적발 날짜는 필수입니다.');
    }

    const id = body.id || crypto.randomUUID();
    const cleanPlate = plate.trim().toUpperCase();
    const cleanDate = date.trim();
    const cleanStaff = staff || '';
    const cleanNote = note || '';

    await env.DB.prepare(
      'INSERT INTO fac_records (id, plate, date, staff, note) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, cleanPlate, cleanDate, cleanStaff, cleanNote).run();

    return jsonResponse({ id, plate: cleanPlate, date: cleanDate, staff: cleanStaff, note: cleanNote });
  } catch (e) {
    return errorResponse('기록 저장 실패: ' + e.message, 500);
  }
}

// DELETE /api/records (전체 삭제 - 관리자 전용)
export async function onRequestDelete({ request, env }) {
  try {
    const user = await requireAuth(request, env);
    if (!user) {
      return errorResponse('관리자 로그인이 필요합니다.', 401);
    }

    await env.DB.prepare('DELETE FROM fac_records').run();
    return jsonResponse({ success: true, message: '모든 기록이 삭제되었습니다.' });
  } catch (e) {
    return errorResponse('전체 삭제 실패: ' + e.message, 500);
  }
}
