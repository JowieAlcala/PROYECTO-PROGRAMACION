const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Tasques
router.get('/todos', controller.getTasks);
router.post('/todos', controller.createTask);
router.put('/todos/:id', controller.toggleTask);
router.delete('/todos/:id', controller.deleteTask);

// Botiga
router.get('/shop', controller.getShop);
router.post('/shop/buy/:id', controller.buyItem);

// Inventari
router.get('/inventory', controller.getInventory);

// Diàlegs
router.get('/dialogues', controller.getDialogues);

// XP del usuario
router.get('/user/xp', controller.getUserXp);

module.exports = router;