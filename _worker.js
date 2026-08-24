import { onRequestGet as getRecords, onRequestPost as postRecords, onRequestDelete as deleteRecords } from './functions/api/records/index.js';
import { onRequestDelete as deleteSingleRecord } from './functions/api/records/[id].js';
import { onRequestGet as getManagers, onRequestPost as postManagers } from './functions/api/managers/index.js';
import { onRequestDelete as deleteSingleManager } from './functions/api/managers/[id].js';
import { onRequestGet as getRestrict, onRequestPost as postRestrict } from './functions/api/restrict/index.js';
import { onRequestPost as postLogin, onRequestGet as getLogin } from './functions/api/auth/login.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // API 라우팅
    try {
      if (path === '/api/auth/login') {
        if (method === 'POST') return await postLogin({ request, env });
        if (method === 'GET') return await getLogin({ request, env });
      }

      if (path === '/api/records') {
        if (method === 'GET') return await getRecords({ env });
        if (method === 'POST') return await postRecords({ request, env });
        if (method === 'DELETE') return await deleteRecords({ request, env });
      }

      if (path.startsWith('/api/records/')) {
        const id = decodeURIComponent(path.replace('/api/records/', ''));
        if (method === 'DELETE') return await deleteSingleRecord({ params: { id }, request, env });
      }

      if (path === '/api/managers') {
        if (method === 'GET') return await getManagers({ env });
        if (method === 'POST') return await postManagers({ request, env });
      }

      if (path.startsWith('/api/managers/')) {
        const id = decodeURIComponent(path.replace('/api/managers/', ''));
        if (method === 'DELETE') return await deleteSingleManager({ params: { id }, request, env });
      }

      if (path === '/api/restrict') {
        if (method === 'GET') return await getRestrict({ env });
        if (method === 'POST') return await postRestrict({ request, env });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 정적 파일 서빙 (HTML, CSS, JS, Manifest 등)
    if (env.ASSETS) {
      return await env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
