const API = '/api';

export async function api(path, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(text || res.statusText);
  }
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

export async function login(email, password) {
  return api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function signup(email, password, passwordConfirm) {
  return api('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, passwordConfirm }) });
}

export async function logout() {
  return api('/auth/logout', { method: 'POST' });
}

export async function getMe() {
  return api('/auth/me');
}

export async function createUser(payload) {
  return api('/auth/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getUsers() {
  return api('/auth/admin/users');
}

export async function updateUser(id, payload) {
  return api(`/auth/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id) {
  return api(`/auth/admin/users/${id}`, { method: 'DELETE' });
}

export async function getFiles() {
  return api('/files');
}

export async function uploadFile(formData) {
  const res = await fetch(API + '/files', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(text || res.statusText);
  }
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

export function getDownloadUrl(id) {
  return `${API}/files/${id}/download`;
}

export function getProfileImageUrl(profile_image_path) {
  if (!profile_image_path || typeof profile_image_path !== 'string') return null;
  const path = profile_image_path.replace(/^\/+/, '');
  return path ? `/uploads/${path}` : null;
}

export async function deleteFile(id) {
  return api(`/files/${id}`, { method: 'DELETE' });
}

export async function getCharts() {
  return api('/charts');
}
