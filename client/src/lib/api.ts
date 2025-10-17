const API_BASE_URL = '';

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('adminToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Token expired or invalid, clear storage and notify auth context
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Dispatch custom event to notify AuthContext
    window.dispatchEvent(new CustomEvent('auth-logout'));
    
    window.location.href = '/admin/login';
    throw new Error('Authentication required');
  }

  return response;
}

