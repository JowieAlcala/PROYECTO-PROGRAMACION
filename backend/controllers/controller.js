const Task = require('../models/ModelPrincipal');
const InventoryItem = require('../models/Inventory');

// Shop items fixos
const shopItems = [
  { id: 'hp_potion', name: 'Health Potion', price: 50 },
  { id: 'mp_potion', name: 'Mana Potion',   price: 75 },
  { id: 'sword',     name: 'Iron Sword',     price: 200 }
];

// Diàlegs fixos
const dialogues = [
  { id: 1, text: '👾 Mercader: Benvingut aventurer! Què desitges?' },
  { id: 2, text: '🧙 Sàvia: Recorda completar les missions per guanyar XP.' },
  { id: 3, text: '⚔️ Guerrer: La propera batalla serà intensa!' }
];

// Obtener todas las tareas
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

// Alternar el estado de una tarea (completada/no completada)
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    task.completed = !task.completed; // Asumiendo que tienes un campo "completed"
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

// Funciones existentes
exports.getShop = (req, res) => res.json(shopItems);
exports.getInventory = async (req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
};
exports.buyItem = async (req, res) => {
  const { id } = req.params;
  const shopItem = shopItems.find(i => i.id === id);
  if (!shopItem) return res.status(404).json({ error: 'Item no trobat' });

  let inv = await InventoryItem.findOne({ name: shopItem.name });
  if (inv) {
    inv.quantity++;
  } else {
    inv = new InventoryItem({ name: shopItem.name, price: shopItem.price, quantity: 1 });
  }
  await inv.save();
  res.json(inv);
};
exports.getDialogues = (req, res) => res.json(dialogues);