# Writeups Hub

Website interactiva para guardar y mostrar writeups de HTB y CTF, con un panel admin para añadir nuevos registros.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Ejecutar

```bash
PORT=3000 ADMIN_PASSWORD=tu_password node server.js
```

La web estará en:
- http://localhost:3000
- http://localhost:3000/admin

## Panel admin

- Entra a `/admin`
- Escribe la contraseña configurada por `ADMIN_PASSWORD`
- Añade máquinas, dificultad, Tags y contenido detallado

## Deploy en Debian / Ubuntu

### 1) Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2) Clonar el repositorio

```bash
git clone https://github.com/Risas1312/htb-writeups.git
cd htb-writeups
```

### 3) Instalar dependencias

```bash
npm install
```

### 4) Ejecutar con un servicio de sistema

```bash
sudo nano /etc/systemd/system/writeups.service
```

Contenido:

```ini
[Unit]
Description=Writeups Hub
After=network.target

[Service]
WorkingDirectory=/home/tuusuario/htb-writeups
ExecStart=/usr/bin/node /home/tuusuario/htb-writeups/server.js
Restart=always
Environment=PORT=3000
Environment=ADMIN_PASSWORD=tu_password_segura

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable writeups
sudo systemctl start writeups
```

Tu sitio quedará disponible en:
- http://IP_DEL_SERVIDOR:3000
- http://IP_DEL_SERVIDOR:3000/admin

## Ajustes

- Puedes cambiar la contraseña con la variable `ADMIN_PASSWORD`
- Puedes editar `data/writeups.json` manualmente si quieres añadir entradas directamente
- Puedes cambiar el estilo y layout desde `public/styles.css`

## Estructura

```text
.
├── data/
│   ├── config.json
│   └── writeups.json
├── public/
│   ├── admin.html
│   ├── admin.js
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── package.json
├── server.js
└── README.md
```
