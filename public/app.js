const modal = document.getElementById('writeupModal');
const modalBody = document.getElementById('modalBody');
const cardsContainer = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = [...document.querySelectorAll('.filter-btn')];

let writeups = [];
let activeFilter = 'all';

function formatMarkdown(text) {
  if (!text) return '<p>Sin contenido.</p>';

  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = escaped.split('\n');
  let html = '';

  for (const line of lines) {
    if (line.startsWith('### ')) {
      html += `<h3>${line.replace('### ', '')}</h3>`;
    } else if (line.startsWith('## ')) {
      html += `<h2>${line.replace('## ', '')}</h2>`;
    } else if (line.startsWith('- ')) {
      html += `<li>${line.replace('- ', '')}</li>`;
    } else if (line.trim() === '') {
      html += '<br>';
    } else {
      html += `<p>${line}</p>`;
    }
  }

  return html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
}

function renderCards() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = writeups.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.difficulty === activeFilter || item.os === activeFilter;
    const haystack = `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesFilter && matchesSearch;
  });

  cardsContainer.innerHTML = filtered.map((item) => `
    <article class="writeup-card" data-id="${item.id}">
      <div class="card-top">
        <span class="badge ${item.difficulty.toLowerCase()}">${item.difficulty}</span>
        <span class="badge os-badge">${item.os}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="tag-row">
        ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <button class="open-btn" data-id="${item.id}">Abrir writeup</button>
    </article>
  `).join('');

  document.getElementById('totalMachines').textContent = writeups.length;
  document.getElementById('linuxCount').textContent = writeups.filter((w) => w.os === 'Linux').length;
  document.getElementById('windowsCount').textContent = writeups.filter((w) => w.os === 'Windows').length;

  document.querySelectorAll('.open-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const item = writeups.find((entry) => entry.id === button.dataset.id);
      modalBody.innerHTML = `
        <div class="modal-header">
          <span class="badge ${item.difficulty.toLowerCase()}">${item.difficulty}</span>
          <span class="badge os-badge">${item.os}</span>
        </div>
        <h2>${item.title}</h2>
        <div class="article-body">${formatMarkdown(item.content)}</div>
      `;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    });
  });
}

async function loadWriteups() {
  const res = await fetch('/api/writeups');
  writeups = await res.json();
  renderCards();
}

searchInput.addEventListener('input', renderCards);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderCards();
  });
});

document.getElementById('closeModal').addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
});

loadWriteups();
