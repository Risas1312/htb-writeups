const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_FILE = path.join(__dirname, 'data', 'writeups.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = [
      {
        id: 'forest',
        title: 'Forest',
        difficulty: 'Easy',
        os: 'Linux',
        status: 'Completed',
        summary: 'Enumeración de SMB, abuso de Kerberos y escalada de privilegios.',
        tags: ['SMB', 'Kerberos', 'PrivEsc'],
        content: '## Forest\n\n### Reconocimiento\n- Identificar SMB.\n- Buscar servicios expuestos.\n\n### Explotación\n- Kerberoasting.\n- Crear el foothold.\n\n### PrivEsc\n- Escalada con permisos de servicio.\n- Verificación final de la flag.'
      },
      {
        id: 'blue',
        title: 'Blue',
        difficulty: 'Medium',
        os: 'Windows',
        status: 'Completed',
        summary: 'Explotación de EternalBlue y escalada en entorno Windows.',
        tags: ['SMB', 'Windows', 'RCE'],
        content: '## Blue\n\n### Reconocimiento\n- Verificar puertos SMB.\n- Buscar vulnerabilidad MS17-010.\n\n### Explotación\n- Exploit de SMB.\n- Obtenemos reverse shell.\n\n### Post-explotación\n- Enumerar privilegios y procesar la escalada.'
      },
      {
        id: 'legacy',
        title: 'Legacy',
        difficulty: 'Hard',
        os: 'Linux',
        status: 'Completed',
        summary: 'Servicio legacy y escalada con doble comprobación.',
        tags: ['RCE', 'Privesc', 'Legacy'],
        content: '## Legacy\n\n### Enumeración\n- Revisar servicios legacy.\n- Buscar versiones vulnerables.\n\n### Explotación\n- Abuse de servicio y ejecución remota.\n\n### PrivEsc\n- Búsqueda de misconfiguraciones para root.'
      }
    ];

    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
}

function readWriteups() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeWriteups(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(PUBLIC_DIR));

app.get('/api/writeups', (req, res) => {
  const data = readWriteups();
  res.json(data);
});

app.post('/api/writeups', (req, res) => {
  const password = req.headers['x-admin-password'];

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const items = readWriteups();
  const payload = req.body;

  if (!payload || !payload.title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newItem = {
    id: payload.id || String(Date.now()),
    title: payload.title,
    difficulty: payload.difficulty || 'Medium',
    os: payload.os || 'Linux',
    status: payload.status || 'Completed',
    summary: payload.summary || 'Sin resumen.',
    tags: Array.isArray(payload.tags) ? payload.tags : (payload.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
    content: payload.content || '## Nuevo writeup\n\nEscribe tu contenido aquí.'
  };

  items.unshift(newItem);
  writeWriteups(items);

  res.status(201).json({ message: 'Writeup saved successfully', item: newItem });
});

app.delete('/api/writeups/:id', (req, res) => {
  const password = req.headers['x-admin-password'];

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const items = readWriteups().filter((item) => item.id !== req.params.id);
  writeWriteups(items);
  res.json({ message: 'Writeup deleted' });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
});

app.get('/api/config', (req, res) => {
  res.json({ adminPasswordConfigured: Boolean(ADMIN_PASSWORD) });
});

app.use((req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

ensureDataFile();

app.listen(PORT, () => {
  console.log(`Writeups app running on http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
