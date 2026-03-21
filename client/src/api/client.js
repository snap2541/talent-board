const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '서버 오류');
  return data;
}

export const api = {
  getUsers: () => request('/users'),
  getUser: (slug) => request(`/users/${slug}`),
  scan: (qr_token) => request('/scan', { method: 'POST', body: JSON.stringify({ qr_token }) }),
  addPoints: (qr_token, delta, note) =>
    request('/points', { method: 'POST', body: JSON.stringify({ qr_token, delta, note }) }),
  getQr: (slug) => request(`/qr/${slug}`),
};
