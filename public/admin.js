const adminPasswordInput = document.getElementById('adminPassword');
const unlockBtn = document.getElementById('unlockBtn');
const form = document.getElementById('writeupForm');
const loadBtn = document.getElementById('loadBtn');
const entriesList = document.getElementById('entriesList');
const entriesBox = document.getElementById('entriesBox');

let adminPassword = '';

function setUnlockedState(isUnlocked) {
  form.classList.toggle('hidden', !isUnlocked);
  entriesBox.classList.toggle('hidden', !isUnlocked);
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-password': adminPassword
  };
}

async function loadEntries() {
  const response = await fetch('/api/writeups');
  const items = await response.json();

  entriesList.innerHTML = items.map((item) => `
    <li>
      <div>
        <strong>${item.title}</strong>
        <span>${item.difficulty} • ${item.os}</span>
      </div>
      <button class="danger-btn" data-id="${item.id}">Delete</button>
    </li>
  `).join('');

  entriesList.querySelectorAll('.danger-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await fetch(`/api/writeups/${button.dataset.id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      loadEntries();
    });
  });
}

unlockBtn.addEventListener('click', () => {
  adminPassword = adminPasswordInput.value.trim();
  if (!adminPassword) {
    alert('Ingresa la contraseña');
    return;
  }

  setUnlockedState(true);
  loadEntries();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: document.getElementById('title').value.trim(),
    difficulty: document.getElementById('difficulty').value,
    os: document.getElementById('os').value,
    status: document.getElementById('status').value,
    summary: document.getElementById('summary').value.trim(),
    tags: document.getElementById('tags').value.split(',').map((tag) => tag.trim()).filter(Boolean),
    content: document.getElementById('content').value.trim()
  };

  const response = await fetch('/api/writeups', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    alert('Contraseña incorrecta o error al guardar');
    return;
  }

  form.reset();
  loadEntries();
  alert('Writeup guardado correctamente');
});

loadBtn.addEventListener('click', loadEntries);
