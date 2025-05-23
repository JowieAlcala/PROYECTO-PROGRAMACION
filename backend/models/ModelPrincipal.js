const mongoose = require('mongoose');

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

// TASKS
exports.getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const task = new Task({ title: req.body.title });
  const saved = await task.save();
  res.json(saved);
};

exports.toggleTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'No trobat' });

  task.completed = !task.completed;
  if (task.completed) task.xp += 10;

  const updated = await task.save();
  res.json(updated);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// SHOP
exports.getShop = (req, res) => res.json(shopItems);

exports.buyItem = async (req, res) => {
  const { id } = req.params;
  const shopItem = shopItems.find(i => i.id === id);
  if (!shopItem) return res.status(404).json({ error: 'Item no trobat' });

  let inv = await InventoryItem.findOne({ name: shopItem.name });
  if (inv) inv.quantity++;
  else inv = new InventoryItem({ name: shopItem.name, price: shopItem.price, quantity: 1 });

  await inv.save();
  res.json(inv);
};

// INVENTORY
exports.getInventory = async (req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
};

// DIALOGUES
exports.getDialogues = (req, res) => res.json(dialogues);