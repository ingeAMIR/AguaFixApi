# 💧 AguaFix API

API construida con **NestJS (v11)** y **TypeScript** para la gestión y reporte ciudadano de fugas de agua en la vía pública con evidencia fotográfica en **AWS S3**, base de datos **PostgreSQL** mediante **TypeORM** (con migraciones y `synchronize: false`), notificaciones por correo electrónico con **Nodemailer**, contenedor **Docker** y despliegue continuo a **Docker Hub** con **GitHub Actions**.

---

## 🏗️ Arquitectura del Proyecto

El sistema sigue una arquitectura modular en 4 capas estrictas:
```
Módulo -> Controller -> Service -> Repository -> Base de Datos (PostgreSQL)
                           │
                           ├──> StorageService (AWS S3)
                           └──> EmailService (Nodemailer)
```

- **Módulo (`*.module.ts`)**: Agrupa y gestiona la inyección de dependencias (`TypeOrmModule`, controladores, servicios, repositorios).
- **Controller (`*.controller.ts`)**: Expone las rutas HTTP, gestiona subidas multipart (`FileInterceptor('photo')`), valida las entradas contra los DTOs usando `ValidationPipe` y delega al servicio.
- **Service (`*.service.ts`)**: Contiene la lógica de negocio (validaciones, hashing con `bcryptjs`, subida a S3 mediante `StorageService`, llamado a `EmailService`, orquestación).
- **Repository (`*.repository.ts`)**: Capa de persistencia dedicada para interactuar con TypeORM (`WATER_REPORT`, `SYSTEM_USER`).
- **Storage (`src/storage/`)**: Servicio dedicado que interactúa con `@aws-sdk/client-s3` para almacenar imágenes en buckets de Amazon S3 y generar URLs públicas.

---

## 📋 Requisitos Previos

- **Node.js**: v22+
- **npm**: v10+
- **Docker & Docker Compose** (para levantar PostgreSQL y la API)
- **Cuenta de AWS** con bucket S3 configurado para almacenamiento público de fotos
- **Cuenta de Docker Hub** y repositorio creado (ej. `<usuario>/aguafix-api`)

---

## ⚙️ Configuración del Entorno

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Configura las variables en `.env`:
```env
PORT=3000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secretpassword
DB_NAME=aguafix_db

# Configuración de Correo (Nodemailer SMTP)
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=tu_usuario_smtp
MAIL_PASSWORD=tu_password_smtp
MAIL_FROM="AguaFix Alertas <no-reply@aguafix.gob.mx>"
MAINTENANCE_EMAIL=cuadrilla@aguafix.gob.mx

# AWS S3 Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_aws_access_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret_key
AWS_BUCKET_NAME=tu_bucket_s3

# Docker Hub (para compose.yaml)
DOCKER_USER=tu_usuario_dockerhub
```

---

## 🚀 Instalación y Puesta en Marcha Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar PostgreSQL con Docker
```bash
docker compose up -d postgres-db
```

### 3. Ejecutar las Migraciones
```bash
npm run migration:run
```

Para revertir la última migración:
```bash
npm run migration:revert
```

### 4. Iniciar la Aplicación en Modo Desarrollo
```bash
npm run start:dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 📬 Endpoints de la API

### 💧 Reportes de Fugas (`/reports`)

#### 1. Crear un reporte con foto (Multipart)
- **POST** `/reports`
- **Content-Type:** `multipart/form-data`
- **Campos del Formulario:**
  - `address` (texto): Dirección o referencia de la fuga
  - `description` (texto): Observación detallada de la fuga
  - `severity` (texto): `low`, `medium` o `high`
  - `reporterPhone` (texto): Teléfono de contacto
  - `photo` (archivo, **obligatorio**): Imagen fotográfica de la fuga (JPG, PNG, WEBP)
- **Respuesta (`201 Created`):**
```json
{
  "id": 1,
  "address": "Av. Universidad #602, Col. Lomas del Campestre",
  "description": "Fuga considerable de agua potable en banqueta frente a la entrada principal",
  "severity": "high",
  "reporterPhone": "4771234567",
  "isResolved": false,
  "photoUrl": "https://aguafix-reports-bucket.s3.us-east-1.amazonaws.com/reports/1741800000000-uuid-fuga.jpg",
  "repairPhotoUrl": null,
  "createdAt": "2026-10-24T18:00:00.000Z"
}
```
*Efecto secundario:* Sube la foto al bucket S3 bajo la carpeta `reports/`, guarda el reporte en `WATER_REPORT` con `photoUrl`, y envía un correo electrónico a la cuadrilla de mantenimiento mostrando la foto dentro de la plantilla HTML mediante una etiqueta `<img>`.

#### 2. Listar todos los reportes
- **GET** `/reports`
- **Respuesta (`200 OK`):** Lista de reportes, incluyendo `photoUrl` y `repairPhotoUrl`.

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

#### 2. Inicio de sesión
- **POST** `/auth/login`
- **Body (`LoginDto`):**
```json
{
  "email": "juan.perez@municipio.gob.mx",
  "password": "Password123!"
}
```
- **Error (`400 Bad Request`):** Lanza `BadRequestException` con mensaje claro si las credenciales son incorrectas.

---

## 🐳 Docker y Docker Hub

### Construir la imagen localmente:
```bash
docker build -t <tu_usuario>/aguafix-api:latest .
```

### Ejecutar con Docker Compose (API + PostgreSQL):
```bash
docker compose up -d
```

---

## 🔄 Integración Continua (CI/CD) con GitHub Actions

El repositorio cuenta con un flujo de trabajo en `.github/workflows/docker-publish.yml` que:
1. Se dispara automáticamente con cada `push` a la rama `main`.
2. Realiza login en Docker Hub usando los secretos de GitHub:
   - `DOCKER_USER`: Usuario de Docker Hub
   - `DOCKER_PASSWORD`: Token de acceso personal (PAT) de Docker Hub
3. Construye la imagen con `Dockerfile` en base a `node:22-alpine`.
4. Publica la imagen automáticamente en Docker Hub con la etiqueta `latest`.
