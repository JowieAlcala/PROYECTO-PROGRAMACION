import * as m from './model.js';
import * as v from './view.js';

let tasksCache = [], shopCache = [], dialogues = [], userXp = 0, dlgIndex = 0;

export function init() {
  loadAll();
  document.addEventListener('click', (e) => {
    if (e.target.id === 'addBtn') {
      const input = document.getElementById('taskInput');
      const errorMsg = document.getElementById('errorMsg');
      const title = input.value.trim();
      if (!title) {
        if (errorMsg) errorMsg.textContent = 'Introdueix un títol per a la missió';
        return;
      }
      if (errorMsg) errorMsg.textContent = '';
      m.addTask(title)
        .then(() => {
          input.value = '';
          loadAll();
        })
        .catch(error => {
          console.error('Error al afegir la tasca:', error);
          if (errorMsg) errorMsg.textContent = `Error al afegir la missió: ${error.message}`;
        });
    }
  });
}

async function loadAll() {
  try {
    const [tasks, shop, dialogData, userData] = await Promise.all([
      m.getTasks(),
      m.getShop(),
      m.getDialogues(),
      m.getUserXp()
    ]);
    tasksCache = tasks;
    shopCache = shop;
    dialogues = dialogData; // Usar la variable global
    userXp = userData.totalXp || 0;
  } catch (error) {
    console.error('Error al cargar los datos:', error.message);
    tasksCache = [];
    shopCache = [];
    dialogues = [];
    userXp = 0;
    loadTasks();
    setTimeout(() => {
      const errorMsg = document.getElementById('errorMsg');
      if (errorMsg) errorMsg.textContent = `Error al cargar los datos: ${error.message}`;
    }, 0);
    return;
  }
  loadTasks();
  loadInventory();
}

function loadTasks() {
  const stats = calculateStats();
  const invPromise = m.getInventory();
  invPromise.then(inv => {
    v.render(tasksCache, stats, inv, shopCache, dialogues[dlgIndex] || { text: 'Sin diálogos' }, handleDelete, handleToggle, handleBuy, nextDialogue);
  }).catch(error => {
    console.error('Error al cargar inventario:', error.message);
    v.render(tasksCache, stats, [], shopCache, dialogues[dlgIndex] || { text: 'Sin diálogos' }, handleDelete, handleToggle, handleBuy, nextDialogue);
    setTimeout(() => {
      const errorMsg = document.getElementById('errorMsg');
      if (errorMsg) errorMsg.textContent = `Error al cargar inventario: ${error.message}`;
    }, 0);
  });
}

function loadInventory() {
  m.getInventory().then(inv => {
    loadTasks();
  }).catch(error => {
    console.error('Error al cargar inventario:', error.message);
    loadTasks();
  });
}

function handleDelete(id) {
  m.deleteTask(id).then(loadAll).catch(error => {
    console.error('Error al eliminar:', error);
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) errorMsg.textContent = `Error al eliminar: ${error.message}`;
  });
}

function handleToggle(id) {
  m.toggleTask(id).then(loadAll).catch(error => {
    console.error('Error al alternar:', error);
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) errorMsg.textContent = `Error al alternar: ${error.message}`;
  });
}

function handleBuy(id) {
  m.buyItem(id).then(loadAll).catch(error => {
    console.error('Error al comprar:', error);
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) errorMsg.textContent = ` ${error.message}`;
  });
}

function nextDialogue() {
  dlgIndex = (dlgIndex + 1) % (dialogues.length || 1);
  loadTasks();
}

function calculateStats() {
  const totalXp = userXp;
  const level = Math.floor(totalXp / 100) + 1;
  const progress = totalXp % 100;
  return { totalXp, level, progress };
}