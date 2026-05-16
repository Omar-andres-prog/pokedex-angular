import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard';
import { List } from './features/list/list';
import { Detail } from './features/detail/detail';
import { Compare } from './features/compare/compare';

/**
 * Definición de todas las rutas de la aplicación.
 * Angular Router lee este array y decide qué componente renderizar
 * dentro del <router-outlet> según la URL del navegador.
 */
export const routes: Routes = [
  // Ruta raíz: redirige siempre al dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },

  { path: 'list', component: List },

  // :id es un parámetro dinámico de ruta.
  // Se puede leer en el componente con ActivatedRoute.snapshot.paramMap.get('id')
  { path: 'detail/:id', component: Detail },

  // Ruta del punto extra: comparador de dos Pokémon
  { path: 'compare', component: Compare },

  // Wildcard: cualquier ruta no reconocida vuelve al dashboard
  { path: '**', redirectTo: 'dashboard' },
];
