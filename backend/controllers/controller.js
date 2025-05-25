const Task = require('../models/ModelPrincipal');
const InventoryItem = require('../models/Inventory');
const User = require('../models/User');

// Shop items fixos
const shopItems = [
  { id: 'hp_potion', name: 'Health Potion', price: 50 },
  { id: 'mp_potion', name: 'Mana Potion', price: 75 },
  { id: 'sword', name: 'Iron Sword', price: 200 }
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
    task.completed = !task.completed;

    // Actualizar XP del usuario
    let user = await User.findOne({ username: 'default' });
    if (!user) {
      user = new User({ username: 'default', totalXp: 0 });
      await user.save();
    }

    if (task.completed) {
      user.totalXp += 10;
    } else {
      user.totalXp = Math.max(0, user.totalXp - 10);
    }
    await user.save();
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

// Obtener XP del usuario
exports.getUserXp = async (req, res) => {
  try {
    let user = await User.findOne({ username: 'default' });
    if (!user) {
      user = new User({ username: 'default', totalXp: 0 });
      await user.save();
    }
    res.json({ totalXp: user.totalXp });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener XP' });
  }
};

// Funciones de la tienda
exports.getShop = (req, res) => res.json(shopItems);

// Obtener el inventario
exports.getInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
};

// Comprar un item
exports.buyItem = async (req, res) => {
  try {
    const { id } = req.params;
    const shopItem = shopItems.find(i => i.id === id);
    if (!shopItem) return res.status(404).json({ error: 'Item no trobat' });

    // Verificar XP del usuario
    let user = await User.findOne({ username: 'default' });
    if (!user) {
      user = new User({ username: 'default', totalXp: 0 });
      await user.save();
    }
    if (user.totalXp < shopItem.price) {
      return res.status(400).json({ error: 'No tens suficient XP per comprar aquest item' });
    }

    // Restar XP
    user.totalXp -= shopItem.price;
    await user.save();

    // Añadir al inventario
    let inv = await InventoryItem.findOne({ name: shopItem.name });
    if (inv) {
      inv.quantity++;
    } else {
      inv = new InventoryItem({ name: shopItem.name, price: shopItem.price, quantity: 1 });
    }
    await inv.save();

    res.json(inv);
  } catch (error) {
    res.status(500).json({ error: 'Error al comprar el item' });
  }
};

// Diálogos
exports.getDialogues = (req, res) => res.json(dialogues);