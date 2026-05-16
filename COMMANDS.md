# Pokédex — Comandos del proyecto

Registro de comandos utilizados durante el desarrollo de la práctica.

---

## Requisitos previos

```bash
# Instalar Node.js (versión LTS) desde https://nodejs.org/
node -v        # Verificar instalación de Node.js
npm -v         # Verificar instalación de npm

# Instalar Angular CLI de forma global
npm install -g @angular/cli

# Verificar la versión de Angular CLI
ng version
```

---

## Crear el proyecto

```bash
# ng new: crea un proyecto Angular desde cero.
# --routing: genera el archivo app.routes.ts con el sistema de rutas
# --style=scss: usa SCSS en lugar de CSS plano
# --skip-git: no inicializa un repositorio git (lo haremos manualmente)
ng new pokedex --routing --style=scss --skip-git

# Entrar al directorio del proyecto
cd pokedex

# Iniciar el servidor de desarrollo (http://localhost:4200)
ng serve
```

---

## Generación de componentes y servicios

> Angular CLI genera los archivos del componente/servicio con la estructura correcta y los registra automáticamente.

```bash
# Componentes de las vistas principales (features)
ng generate component features/dashboard --skip-tests
ng generate component features/list --skip-tests
ng generate component features/detail --skip-tests
ng generate component features/compare --skip-tests

# Componente compartido reutilizable
ng generate component shared/pokemon-card --skip-tests

# Servicio de peticiones HTTP a la PokéAPI
ng generate service core/services/pokemon --skip-tests
```

---

## Desarrollo diario

```bash
# Servidor de desarrollo con hot reload (detecta cambios y recarga)
ng serve

# Servidor en un puerto específico
ng serve --port 4201

# Verificar que el código TypeScript compila sin errores
ng build

# Build optimizado para producción (minificado, tree-shaking)
ng build --configuration production
```

---

## Control de versiones (Git)

```bash
# Inicializar repositorio git
git init

# Ver estado de los archivos
git status

# Añadir todos los archivos al staging area
git add .

# Crear el primer commit
git commit -m "feat: initial pokedex project setup"

# Vincular con el repositorio remoto de GitHub
git remote add origin https://github.com/tu-usuario/pokedex.git

# Subir al repositorio (primera vez)
git push -u origin main

# Subir cambios posteriores
git push
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── pokemon.model.ts      # Interfaces TypeScript de la PokéAPI
│   │   └── services/
│   │       └── pokemon.ts            # Servicio con todas las llamadas HTTP
│   ├── features/
│   │   ├── dashboard/                # Vista principal: aleatorios + búsqueda
│   │   ├── list/                     # Listado paginado (20 por página)
│   │   ├── detail/                   # Detalle de un Pokémon
│   │   └── compare/                  # Comparador de dos Pokémon (extra)
│   ├── shared/
│   │   └── pokemon-card/             # Tarjeta reutilizable
│   ├── app.config.ts                 # Configuración global (provideHttpClient, provideRouter)
│   ├── app.routes.ts                 # Definición de rutas
│   ├── app.ts                        # Componente raíz con navbar
│   └── app.html                      # Template del navbar + router-outlet
└── styles.scss                       # Estilos globales y variables CSS
```

---

## API utilizada

- **PokéAPI**: https://pokeapi.co/
- **Documentación**: https://pokeapi.co/docs/v2
- **Autenticación**: ninguna (API pública y gratuita)
- **URL base**: `https://pokeapi.co/api/v2/`

### Endpoints principales usados

| Endpoint | Descripción |
|---|---|
| `GET /pokemon?limit=20&offset=0` | Listado paginado |
| `GET /pokemon/:id` | Detalle por ID |
| `GET /pokemon/:name` | Detalle por nombre |
