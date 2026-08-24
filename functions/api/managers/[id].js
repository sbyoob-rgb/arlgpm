import { jsonResponse, errorResponse, requireAuth } from '../_utils.js';

// DELETE /api/managers/:id (담당자 삭제 - 관리자 전용)
export async function onRequestDelete({ params, request, env }) {
  try {
    const user = await requireAuth(request, env);
    if (!user) {
      return errorResponse('관리자 로그인이 필요합니다.', 401);
    }

    const { id } = params;
    if (!id) {
      return errorResponse('삭제할 담당자 ID가 지정되지 않았습니다.');
    }

    await env.DB.prepare('DELETE FROM fac_managers WHERE id = ?')
      .bind(id)
      .run();

    return jsonResponse({ success: true, deletedId: id });
  } catch (e) {
    return errorResponse('담당자 삭제 실패: ' + e.message, 500);
  }
}
