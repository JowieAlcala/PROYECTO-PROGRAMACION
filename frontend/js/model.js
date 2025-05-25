const BASE_URL = '/api';

const fetchWithErrorLogging = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error en ${url}: ${response.status} - ${text}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error en ${url}:`, error.message);
    throw error;
  }
};

export const getTasks = async () => {
  return fetchWithErrorLogging(`${BASE_URL}/todos`);
};

export const addTask = async title => {
  return fetchWithErrorLogging(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
};

export const deleteTask = async id => {
  return fetchWithErrorLogging(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
};

export const toggleTask = async id => {
  return fetchWithErrorLogging(`${BASE_URL}/todos/${id}`, { method: 'PUT' });
};

export const getShop = async () => {
  return fetchWithErrorLogging(`${BASE_URL}/shop`);
};

export const buyItem = async id => {
  return fetchWithErrorLogging(`${BASE_URL}/shop/buy/${id}`, { method: 'POST' });
};

export const getInventory = async () => {
  return fetchWithErrorLogging(`${BASE_URL}/inventory`);
};

export const getDialogues = async () => {
  return fetchWithErrorLogging(`${BASE_URL}/dialogues`);
};

export const getUserXp = async () => {
  return fetchWithErrorLogging(`${BASE_URL}/user/xp`);
};