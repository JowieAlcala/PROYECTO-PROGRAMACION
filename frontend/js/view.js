export function render(tasks, stats, inventory, shop, dialogue, onDelete, onToggle, onBuy, onNextDialogue) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <div class="stats">
        <div>👤 Nivell: ${stats.level}</div>
        <div>💎 XP: ${stats.totalXp}</div>
      </div>
      <div class="xp-bar"><div class="fill" style="width:0"></div></div>
    </div>
    <div id="errorMsg" style="color: red; margin-bottom: 1rem;"></div>
    <div class="input-row">
      <input id="taskInput" placeholder="Nova missió..." />
      <button id="addBtn">Afegeix</button>
    </div>

    <h2>🎒 Inventari</h2>
    <ul id="inventoryList">
      ${inventory.map(i => `<li>${i.name} x${i.quantity}</li>`).join('') || '<li>Buida</li>'}
    </ul>

    <h2>🏪 Botiga</h2>
    <ul id="shopList">
      ${shop.map(i =>
        `<li>
          ${i.name} - ${i.price}💎
          <button data-id="${i.id}" class="buy">Compra</button>
        </li>`
      ).join('')}
    </ul>

    <div id="dialogueBox" class="dialogue">
      <p>${dialogue.text}</p>
      <button id="nextDialogue">…</button>
    </div>

    <h2>📜 Missions</h2>
    <ul id="taskList">
      ${tasks.map(t => `
        <li>
          ${t.title} ${t.completed ? '✅' : ''}
          <button data-id="${t._id}" class="toggle">${t.completed ? 'Desmarcar' : 'Completar'}</button>
          <button data-id="${t._id}" class="delete">Eliminar</button>
        </li>
      `).join('') || '<li>Sin missions</li>'}
    </ul>
  `;

  requestAnimationFrame(() => {
    document.querySelector('.xp-bar .fill').style.width = `${stats.progress}%`;
  });

  app.querySelectorAll('.delete').forEach(btn => btn.onclick = () => onDelete(btn.dataset.id));
  app.querySelectorAll('.toggle').forEach(btn => btn.onclick = () => onToggle(btn.dataset.id));
  app.querySelectorAll('.buy').forEach(btn => btn.onclick = () => onBuy(btn.dataset.id));
  document.getElementById('nextDialogue').onclick = onNextDialogue;
}