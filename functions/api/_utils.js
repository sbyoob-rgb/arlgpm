// ===================================================
// Cloudflare Pages Functions - Common Utilities
// ===================================================

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// 비밀번호 해싱 (SHA-256 + Salt)
export async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':' + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// JWT 생성 (HMAC SHA-256)
export async function createJWT(payload, secret = 'arlgpm-jwt-secret-key-default-2024') {
  const enc = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const b64Header = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const b64Payload = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(`${b64Header}.${b64Payload}`)
  );
  
  const b64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  return `${b64Header}.${b64Payload}.${b64Signature}`;
}

// JWT 검증
export async function verifyJWT(token, secret = 'arlgpm-jwt-secret-key-default-2024') {
  if (!token) return null;
  try {
    const [b64Header, b64Payload, b64Signature] = token.split('.');
    if (!b64Header || !b64Payload || !b64Signature) return null;
    
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // Base64Url 디코딩
    const signatureStr = atob(b64Signature.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(signatureStr.length);
    for (let i = 0; i < signatureStr.length; i++) sigBytes[i] = signatureStr.charCodeAt(i);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(`${b64Header}.${b64Payload}`)
    );
    
    if (!isValid) return null;
    
    const payload = JSON.parse(atob(b64Payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    
    return payload;
  } catch (e) {
    return null;
  }
}

// 관리자 인증 필수 검사
export async function requireAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7);
  const secret = env.JWT_SECRET || 'arlgpm-jwt-secret-key-default-2024';
  return await verifyJWT(token, secret);
}
