# Pokédex con Angular

Práctica de Desarrollo Web en Entorno Cliente - 2º DAW  
EFA El Campico

---

## ¿Qué es esto?

Una Pokédex hecha con Angular que usa la PokéAPI para mostrar información de los Pokémon.  
Es una práctica del módulo de Desarrollo Web en Entorno Cliente donde he aplicado routing, peticiones HTTP, servicios y otras cosas de Angular.

---

## ¿Qué tiene la aplicación?

- **Dashboard**: muestra 10 Pokémon aleatorios cada vez que entras o recargas
- **Buscador**: puedes buscar cualquier Pokémon por su nombre desde el dashboard
- **Listado**: lista todos los Pokémon de 20 en 20 con botones para pasar de página
- **Detalle**: al hacer clic en un Pokémon ves su imagen, tipos, estadísticas, altura, peso y habilidades
- **Comparador**: puedes comparar las estadísticas de dos Pokémon (punto extra)

---

## Tecnologías usadas

- Angular 21
- TypeScript
- SCSS
- RxJS
- PokéAPI (https://pokeapi.co/)

---

## Cómo ejecutarlo

Necesitas tener instalado Node.js y Angular CLI.

```bash
# Clonar el repositorio
git clone https://github.com/omar-andres-prog/pokedex-angular.git
cd pokedex-angular

# Instalar las dependencias
npm install

# Arrancar la aplicación
ng serve
```

Luego abres el navegador en http://localhost:4200

---

## Estructura de carpetas

```
src/app/
├── core/
│   ├── models/       → interfaces TypeScript para tipar la API
│   └── services/     → servicio con todas las llamadas HTTP
├── features/
│   ├── dashboard/    → página principal con aleatorios y búsqueda
│   ├── list/         → listado paginado
│   ├── detail/       → detalle de cada Pokémon
│   └── compare/      → comparador de dos Pokémon
└── shared/
    └── pokemon-card/ → tarjeta reutilizable
```

---

## API

He usado la PokéAPI que es gratuita y no necesita registro ni API key.  
Documentación: https://pokeapi.co/docs/v2
