# 💧 AguaFix API

API construida con **NestJS (v11)** y **TypeScript** para la gestión y reporte ciudadano de fugas de agua en la vía pública por parte del municipio.

Cuando un ciudadano registra un reporte, la información se persiste en una base de datos **PostgreSQL** mediante **TypeORM** (utilizando migraciones con `synchronize: false`) y de inmediato se envía una notificación por correo electrónico a la cuadrilla de mantenimiento utilizando **Nodemailer** con una plantilla HTML legible y responsiva.

---

## 🏗️ Arquitectura del Proyecto

El sistema sigue una arquitectura modular en 4 capas estrictas:
```
Módulo -> Controller -> Service -> Repository -> Base de Datos (PostgreSQL)
```

- **Módulo (`*.module.ts`)**: Agrupa y gestiona la inyección de dependencias (`TypeOrmModule`, controladores, servicios, repositorios).
- **Controller (`*.controller.ts`)**: Expone las rutas HTTP, valida las entradas contra los DTOs usando `ValidationPipe` y delega al servicio.
- **Service (`*.service.ts`)**: Contiene la lógica de negocio (validaciones, hashing con `bcryptjs`, llamado a `EmailService`, orquestación).
- **Repository (`*.repository.ts`)**: Capa de persistencia dedicada para interactuar con TypeORM (`WATER_REPORT`, `SYSTEM_USER`).

---

## 📋 Requisitos Previos

- **Node.js**: v18+ o v22+
- **npm**: v9+ o v10+
- **Docker & Docker Compose** (para levantar PostgreSQL)
- **Bruno** (opcional, para ejecutar las pruebas de API)

---

## ⚙️ Configuración del Entorno

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Revisa las variables en `.env`:
```env
PORT=3000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secretpassword
DB_NAME=aguafix_db

# Configuración de Correo (Nodemailer SMTP)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=tu_usuario_smtp
MAIL_PASSWORD=tu_password_smtp
MAIL_FROM="AguaFix Alertas <no-reply@aguafix.gob.mx>"
MAINTENANCE_EMAIL=cuadrilla@aguafix.gob.mx
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar la Base de Datos con Docker
```bash
docker compose up -d
```

### 3. Ejecutar las Migraciones
```bash
npm run migration:run
```

Si deseas revertir la última migración:
```bash
npm run migration:revert
```

Para generar una nueva migración tras cambiar entidades:
```bash
npm run migration:generate -- src/migrations/NombreDeLaMigracion
```

### 4. Iniciar la Aplicación en Modo Desarrollo
```bash
npm run start:dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 📬 Endpoints de la API

### 💧 Reportes de Fugas (`/reports`)

#### 1. Crear un reporte
- **POST** `/reports`
- **Body (`CreateReportDto`):**
```json
{
  "address": "Av. Universidad #602, Col. Lomas del Campestre",
  "description": "Fuga considerable de agua potable en banqueta frente a la entrada principal",
  "severity": "high",
  "reporterPhone": "4771234567"
}
```
- **Respuesta (`201 Created`):**
```json
{
  "id": 1,
  "address": "Av. Universidad #602, Col. Lomas del Campestre",
  "description": "Fuga considerable de agua potable en banqueta frente a la entrada principal",
  "severity": "high",
  "reporterPhone": "4771234567",
  "isResolved": false,
  "createdAt": "2026-09-11T21:50:00.000Z"
}
```
*Efecto secundario:* Despacha un correo electrónico a `envs.MAINTENANCE_EMAIL` con el formato HTML generado por `generateReportTemplate`.

#### 2. Listar todos los reportes
- **GET** `/reports`
- **Respuesta (`200 OK`):** Lista de reportes ordenados.

---

### 🔐 Autenticación y Usuarios (`/auth`)

#### 1. Registro de usuario
- **POST** `/auth/register`
- **Body (`CreateUserDto`):**
```json
{
  "name": "Juan Perez",
  "email": "juan.perez@municipio.gob.mx",
  "password": "Password123!",
  "isNotificationEnabled": true
}
```
- **Respuesta (`201 Created`):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan.perez@municipio.gob.mx",
    "isNotificationEnabled": true
  }
}
```

#### 2. Inicio de sesión
- **POST** `/auth/login`
- **Body (`LoginDto`):**
```json
{
  "email": "juan.perez@municipio.gob.mx",
  "password": "Password123!"
}
```
- **Respuesta Éxito (`200 OK`):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan.perez@municipio.gob.mx",
    "isNotificationEnabled": true
  }
}
```
- **Respuesta Error (`400 Bad Request`):**
```json
{
  "message": "Credenciales inválidas: correo o contraseña incorrectos",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 📧 Plantilla de Correo HTML

Ubicada en `src/reports/templates/report.template.ts`, la función `generateReportTemplate` genera un correo con:
- Encabezado institucional con gradiente municipal.
- Tabla estilizada con estilos inline para compatibilidad con clientes de correo (Outlook, Gmail, etc.).
- Badge de severidad con color distintivo (Rojo: Alta, Naranja: Media, Verde: Baja).
- Dirección, descripción y teléfono de contacto clickeable (`tel:`).
- Nota de aviso para atención inmediata por la cuadrilla.

---

## 🧪 Pruebas con Colección Bruno

En la carpeta `bruno/AguaFixApi` se encuentran todas las peticiones listas para importar y probar en **Bruno**:
- `Create Report`
- `Get All Reports`
- `Register User`
- `Login User Success`
- `Login User Invalid Credentials`
