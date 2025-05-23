import * as m from './model.js';
import * as v from './view.js';

let tasksCache = [], shopCache = [], dialogues = [], dlgIndex = 0;

export function init() {
  loadAll();
  // El evento para addBtn se maneja en view.js, así que no es necesario aquí
}

async function loadAll() {
  try {
    [ tasksCache, shopCache, dialogues ] = await Promise.all([
      m.getTasks(), m.getShop(), m.getDialogues()
    ]);
  } catch (error) {
    console.error('Error al cargar los datos:', error.message);
    tasksCache = [];
    shopCache = [];
    dialogues = [];
  }
  loadTasks();
  loadInventory();
}

function loadTasks() {
  const stats = calculateStats(tasksCache);
  const invPromise = m.getInventory();
  invPromise.then(inv => {
    v.render(tasksCache, stats, inv, shopCache, dialogues[dlgIndex] || { text: 'Sin diálogos' }, handleDelete, handleToggle, handleBuy, nextDialogue);
  }).catch(error => {
    console.error('Error al cargar inventario:', error.message);
    v.render(tasksCache, stats, [], shopCache, dialogues[dlgIndex] || { text: 'Sin diálogos' }, handleDelete, handleToggle, handleBuy, nextDialogue);
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

function handleDelete(id) { m.deleteTask(id).then(loadAll).catch(console.error); }
function handleToggle(id) { m.toggleTask(id).then(loadAll).catch(console.error); }
function handleBuy(id)    { m.buyItem(id).then(loadInventory).catch(console.error); }
function nextDialogue()   {
  dlgIndex = (dlgIndex + 1) % (dialogues.length || 1);
  loadTasks();
}

function calculateStats(tasks) {
  if (!Array.isArray(tasks)) {
    console.error('tasks no es un array:', tasks);
    return { totalXp: 0, level: 1, progress: 0 };
  }
  const totalXp = tasks.reduce((s, t) => s + (t.xp || 0), 0);
  const level = Math.floor(totalXp / 100) + 1;
  const progress = totalXp % 100;
  return { totalXp, level, progress };
}