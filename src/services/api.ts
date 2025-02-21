// api.ts
export const BASE_URL = 'http://localhost:8080';

export const fetchGET = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`GET request error: ${response.statusText}`);
  }

  return await response.json();
};

export const fetchPOST = async (endpoint: string, data: any) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`POST request error: ${response.statusText}`);
  }

  return await response.json();
};

export const fetchPUT = async (endpoint: string, data: any) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`PUT request error: ${response.statusText}`);
  }

  return await response.json();
};

export const fetchDELETE = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`DELETE request error: ${response.statusText}`);
  }

  return await response.json();
};
