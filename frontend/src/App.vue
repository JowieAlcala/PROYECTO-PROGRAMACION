<template>
  <div id="app">
    <div class="header">
      <div class="stats">
        <div>👤 Nivell: {{ stats.level }}</div>
        <div>💎 XP: {{ stats.totalXp }}</div>
      </div>
      <div class="xp-bar">
        <div class="fill" :style="{ width: stats.progress + '%' }"></div>
      </div>
    </div>
    <div id="errorMsg" style="color: red; margin-bottom: 1rem;">{{ errorMessage }}</div>
    <div class="input-row">
      <input v-model="newTaskTitle" placeholder="Nova missió..." @keyup.enter="addTask" />
      <button @click="addTask">Afegeix</button>
    </div>

    <h2>🎒 Inventari</h2>
    <ul id="inventoryList">
      <li v-for="item in inventory" :key="item._id">{{ item.name }} x{{ item.quantity }}</li>
      <li v-if="!inventory.length">Buida</li>
    </ul>

    <h2>🏪 Botiga</h2>
    <ul id="shopList">
      <li v-for="item in shop" :key="item.id">
        {{ item.name }} - {{ item.price }}💎
        <button class="buy" @click="buyItem(item.id)">Compra</button>
      </li>
    </ul>

    <div id="dialogueBox" class="dialogue">
      <p>{{ currentDialogue.text }}</p>
      <button id="nextDialogue" @click="nextDialogue">…</button>
    </div>

    <h2>📜 Missions</h2>
    <ul id="taskList">
      <li v-for="task in tasks" :key="task._id" :class="{ completed: task.completed }">
        {{ task.title }} {{ task.completed ? '✅' : '' }}
        <button class="toggle" @click="toggleTask(task._id)">
          {{ task.completed ? 'Desmarcar' : 'Completar' }}
        </button>
        <button class="delete" @click="deleteTask(task._id)">Eliminar</button>
      </li>
      <li v-if="!tasks.length">Sin missions</li>
    </ul>
  </div>
</template>

<script>
import * as m from './model.js';

export default {
  data() {
    return {
      tasks: [],
      shop: [],
      inventory: [],
      dialogues: [],
      userXp: 0,
      dlgIndex: 0,
      newTaskTitle: '',
      errorMessage: ''
    };
  },
  computed: {
    stats() {
      const totalXp = this.userXp;
      const level = Math.floor(totalXp / 100) + 1;
      const progress = totalXp % 100;
      return { totalXp, level, progress };
    },
    currentDialogue() {
      return this.dialogues[this.dlgIndex] || { text: 'Sin diálogos' };
    }
  },
  methods: {
    async loadAll() {
      try {
        const [tasks, shop, dialogData, userData] = await Promise.all([
          m.getTasks(),
          m.getShop(),
          m.getDialogues(),
          m.getUserXp()
        ]);
        this.tasks = tasks;
        this.shop = shop;
        this.dialogues = dialogData;
        this.userXp = userData.totalXp || 0;
        this.errorMessage = '';
      } catch (error) {
        console.error('Error al cargar los datos:', error.message);
        this.tasks = [];
        this.shop = [];
        this.dialogues = [];
        this.userXp = 0;
        this.errorMessage = `Error al cargar los datos: ${error.message}`;
      }
    },
    async addTask() {
      if (!this.newTaskTitle.trim()) {
        this.errorMessage = 'Introdueix un títol per a la missió';
        return;
      }
      try {
        await m.addTask(this.newTaskTitle);
        this.newTaskTitle = '';
        await this.loadAll();
        this.errorMessage = '';
      } catch (error) {
        console.error('Error al afegir la tasca:', error);
        this.errorMessage = `Error al afegir la missió: ${error.message}`;
      }
    },
    async deleteTask(id) {
      try {
        await m.deleteTask(id);
        await this.loadAll();
        this.errorMessage = '';
      } catch (error) {
        console.error('Error al eliminar:', error);
        this.errorMessage = `Error al eliminar: ${error.message}`;
      }
    },
    async toggleTask(id) {
      try {
        await m.toggleTask(id);
        await this.loadAll();
        this.errorMessage = '';
      } catch (error) {
        console.error('Error al alternar:', error);
        this.errorMessage = `Error al alternar: ${error.message}`;
      }
    },
    async buyItem(id) {
      try {
        await m.buyItem(id);
        await this.loadAll();
        this.errorMessage = '';
      } catch (error) {
        console.error('Error al comprar:', error);
        this.errorMessage = `Error al comprar: ${error.message}`;
      }
    },
    nextDialogue() {
      this.dlgIndex = (this.dlgIndex + 1) % (this.dialogues.length || 1);
    }
  },
  async created() {
    await this.loadAll();
  }
};
</script>

<style scoped>
</style>