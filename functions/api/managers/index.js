import { jsonResponse, errorResponse, requireAuth } from '../_utils.js';

// GET /api/managers
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, created_at FROM fac_managers ORDER BY created_at ASC'
    ).all();
    return jsonResponse(results || []);
  } catch (e) {
    return errorResponse('담당자 목록 조회 실패: ' + e.message, 500);
  }
}

// POST /api/managers (담당자 추가 - 관리자 전용)
export async function onRequestPost({ request, env }) {
  try {
    const user = await requireAuth(request, env);
    if (!user) {
      return errorResponse('관리자 로그인이 필요합니다.', 401);
    }

    const { name } = await request.json();
    if (!name || !name.trim()) {
      return errorResponse('담당자 이름을 입력하세요.');
    }

    const cleanName = name.trim();
    
    // 중복 확인
    const exists = await env.DB.prepare('SELECT id FROM fac_managers WHERE name = ?')
      .bind(cleanName)
      .first();
    if (exists) {
      return errorResponse('이미 등록된 이름입니다.');
    }

    const id = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO fac_managers (id, name) VALUES (?, ?)')
      .bind(id, cleanName)
      .run();

    return jsonResponse({ id, name: cleanName });
  } catch (e) {
    return errorResponse('담당자 저장 실패: ' + e.message, 500);
  }
}
