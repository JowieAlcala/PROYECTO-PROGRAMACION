const BASE_URL = '/api';  // Cambia esto y poner const BASE_URL = 'http://213.97.62.3:3008/api'; para usar el con el serv del gerard

const fetchWithErrorLogging = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const contentType = response.headers.get("Content-Type") || "";
      let errorMessage = `Error ${response.status}`;
      
      if (contentType.includes("application/json")) {
        const data = await response.json();
        errorMessage = data.error || JSON.stringify(data);
      } else {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }

      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    console.error(`Error en ${url}:`, error.message);
    throw error; // El componente Vue puede capturarlo y mostrarlo bien
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