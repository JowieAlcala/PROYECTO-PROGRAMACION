const BASE_URL = 'http://localhost:3000';

export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/api/todos`);
  if (!response.ok) {
    throw new Error(`Error al obtener tareas: ${response.status}`);
  }
  return response.json();
};

export const addTask = async title => {
  const response = await fetch(`${BASE_URL}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!response.ok) {
    throw new Error(`Error al agregar tarea: ${response.status}`);
  }
  return response.json();
};

export const deleteTask = async id => {
  const response = await fetch(`${BASE_URL}/api/todos/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Error al eliminar tarea: ${response.status}`);
  }
  return response.json();
};

export const toggleTask = async id => {
  const response = await fetch(`${BASE_URL}/api/todos/${id}`, { method: 'PUT' });
  if (!response.ok) {
    throw new Error(`Error al alternar tarea: ${response.status}`);
  }
  return response.json();
};

export const getShop = async () => {
  const response = await fetch(`${BASE_URL}/api/shop`);
  if (!response.ok) {
    throw new Error(`Error al obtener tienda: ${response.status}`);
  }
  return response.json();
};

export const buyItem = async id => {
  const response = await fetch(`${BASE_URL}/api/shop/buy/${id}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Error al comprar item: ${response.status}`);
  }
  return response.json();
};

export const getInventory = async () => {
  const response = await fetch(`${BASE_URL}/api/inventory`);
  if (!response.ok) {
    throw new Error(`Error al obtener inventario: ${response.status}`);
  }
  return response.json();
};

export const getDialogues = async () => {
  const response = await fetch(`${BASE_URL}/api/dialogues`);
  if (!response.ok) {
    throw new Error(`Error al obtener diálogos: ${response.status}`);
  }
  return response.json();
};