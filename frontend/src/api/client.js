const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

async function request(path, init) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? message;
      if (body.details?.length) {
        message = `${message}: ${body.details.join('; ')}`;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  getProducts(query = {}) {
    const params = new URLSearchParams();
    if (query.limit != null) params.set('limit', String(query.limit));
    if (query.skip != null) params.set('skip', String(query.skip));
    if (query.category) params.set('category', query.category);
    if (query.search) params.set('search', query.search);
    const qs = params.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },

  getProduct(id) {
    return request(`/products/${id}`);
  },

  getCategories() {
    return request('/categories');
  },

  checkout(payload) {
    return request('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
