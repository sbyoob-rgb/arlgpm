import { jsonResponse, errorResponse, hashPassword, createJWT, requireAuth } from '../_utils.js';

// POST /api/auth/login
export async function onRequestPost({ request, env }) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return errorResponse('이메일과 비밀번호를 입력해 주세요.');
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // 1. admin_users 테이블에서 사용자 확인
    const user = await env.DB.prepare('SELECT * FROM admin_users WHERE email = ?')
      .bind(cleanEmail)
      .first();

    // 등록된 관리자가 없는 경우 (초기 설정): 첫 시도한 이메일/비밀번호를 관리자로 등록
    if (!user) {
      const userCount = await env.DB.prepare('SELECT COUNT(*) as cnt FROM admin_users').first();
      if (userCount && userCount.cnt === 0) {
        const salt = crypto.randomUUID();
        const pwHash = await hashPassword(password, salt);
        await env.DB.prepare('INSERT INTO admin_users (email, password_hash, salt) VALUES (?, ?, ?)')
          .bind(cleanEmail, pwHash, salt)
          .run();
        
        const secret = env.JWT_SECRET || 'arlgpm-jwt-secret-key-default-2024';
        const token = await createJWT({ email: cleanEmail }, secret);
        return jsonResponse({ success: true, token, email: cleanEmail, message: '초기 관리자 계정으로 등록되었습니다.' });
      }
      return errorResponse('이메일 또는 비밀번호가 일치하지 않습니다.', 401);
    }

    // 비밀번호 검증
    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.password_hash) {
      return errorResponse('이메일 또는 비밀번호가 일치하지 않습니다.', 401);
    }

    const secret = env.JWT_SECRET || 'arlgpm-jwt-secret-key-default-2024';
    const token = await createJWT({ email: cleanEmail }, secret);

    return jsonResponse({ success: true, token, email: cleanEmail });
  } catch (e) {
    return errorResponse('로그인 처리 중 오류 발생: ' + e.message, 500);
  }
}

// GET /api/auth/login (현재 토큰 확인)
export async function onRequestGet({ request, env }) {
  const user = await requireAuth(request, env);
  if (!user) {
    return errorResponse('인증되지 않았습니다.', 401);
  }
  return jsonResponse({ authenticated: true, user });
}
