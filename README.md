# Quiz DAW 📘
### Plataforma de repaso teorico para Grado Superior de Desarrollo de Aplicaciones Web

## Descripcion

**Quiz DAW** es una aplicacion web educativa pensada para repasar contenido teorico de modulos del ciclo de DAW mediante cuestionarios tipo test.  
No busca ser un producto complejo, sino una herramienta practica y directa para estudiar, reforzar conceptos y mantener el temario fresco en cualquier momento.

## Leyenda del proyecto 🧩

Este proyecto nace para cubrir una necesidad muy concreta: **repasar teoria de forma rapida y activa**.  
Esta orientado principalmente a estudiantes de DAW (y perfiles similares) que quieren practicar por temas y consolidar conocimientos con feedback inmediato.

Aunque es una aplicacion sencilla en alcance, resulta util porque permite:

- estudiar por modulos y unidades concretas,
- detectar fallos y volver a intentarlo hasta dominar cada tema,
- mantener un seguimiento basico del progreso en local.

## Caracteristicas principales ✅

- Navegacion por modulos desde la pantalla principal.
- Seleccion de temas (UT) dentro de cada modulo.
- Carga dinamica de quizzes desde archivos JSON.
- Resolucion de preguntas tipo test con seleccion de opcion.
- Validacion de respuesta con feedback inmediato (`correcta` / `incorrecta`).
- Explicaciones detalladas por pregunta (temario, analisis de opciones, resumen, ejemplo y conclusion).
- Flujo de repaso: las preguntas falladas se reintentan hasta completarlas correctamente.
- Contador de progreso durante el quiz (acertadas y pendientes de repaso).
- Sistema de cuenta local (sin backend ni contrasena).
- Panel personal protegido con recuento de veces que se completa cada tema.
- Persistencia en `localStorage` (usuarios, sesion y completados).

## Tecnologias utilizadas 🛠️

Tecnologias detectadas actualmente en el proyecto:

- **React 19**
- **Vite 7**
- **React Router DOM 7**
- **Sass (SCSS)**
- **ESLint 9**
- **@vercel/analytics**

## Estructura del proyecto 📂

```text
Quiz-Daw/
├─ src/
│  ├─ Components/
│  │  ├─ core/
│  │  │  ├─ Header.jsx
│  │  │  └─ Footer.jsx
│  │  ├─ ModuleCard.jsx
│  │  ├─ TopicCard.jsx
│  │  ├─ QuizQuestion.jsx
│  │  ├─ QuizProgress.jsx
│  │  └─ ProtectedRoute.jsx
│  ├─ context/
│  │  └─ AuthContext.jsx
│  ├─ data/
│  │  ├─ topicsByModule.jsx
│  │  ├─ quizLoader.js
│  │  ├─ sistemas/*.json
│  │  ├─ entornosDesarrollo/*.json
│  │  ├─ baseDatos/*.json
│  │  ├─ introduccionProgramacion/*.json
│  │  └─ ingles/*.json
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Modulo.jsx
│  │  ├─ Quiz.jsx
│  │  ├─ Auth.jsx
│  │  ├─ Panel.jsx
│  │  └─ 404.jsx
│  ├─ storage/
│  │  └─ quizAppStorage.js
│  ├─ utils/
│  │  └─ buildPanelMatrix.js
│  ├─ styles/
│  │  └─ global.scss (+ parciales SCSS)
│  ├─ App.jsx
│  └─ main.jsx
├─ package.json
├─ vite.config.js
└─ eslint.config.js
```

## Funcionamiento general 🚀

1. El usuario entra en la Home (`/`) y ve los modulos disponibles.
2. Al entrar en un modulo (`/modulo/:moduloId`), puede elegir un tema/UT.
3. Al abrir un tema (`/modulo/:moduloId/:topicId`), se carga el JSON correspondiente mediante `getQuiz(...)`.
4. En cada pregunta:
   - selecciona una opcion,
   - comprueba respuesta,
   - recibe feedback y explicacion ampliada.
5. Si falla una pregunta, se anade a la cola de repaso.
6. Al terminar la ronda, se repiten las falladas hasta acertarlas todas.
7. Cuando completa el tema, se registra el completado para ese usuario en `localStorage`.
8. Si tiene sesion iniciada, puede acceder al panel (`/panel`) para ver su progreso por modulo/tema.

## Instalacion y ejecucion

### Requisitos previos

- **Node.js** (recomendado version actual LTS)
- **npm**

### Instalacion

```bash
npm install
```

### Ejecucion en desarrollo

```bash
npm run dev
```

### Build de produccion

```bash
npm run build
```

### Vista previa de build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Scripts disponibles (`package.json`)

- `dev`: inicia Vite en modo desarrollo.
- `build`: genera build de produccion.
- `preview`: sirve localmente el build generado.
- `lint`: ejecuta ESLint sobre el proyecto.

## Uso

- Abre la aplicacion en navegador.
- En la Home, selecciona un modulo.
- En la pagina del modulo, elige el tema que quieras repasar.
- Responde cada pregunta y usa el feedback para reforzar teoria.
- Continua hasta completar todas las preguntas (incluyendo las falladas).
- (Opcional) Crea una cuenta local o inicia sesion para acceder a una tabla personal para ver cuantas veces has hecho cada test en el panel personal.


## Autor

Proyecto creado y disenado por **Emad Kadyear**.
