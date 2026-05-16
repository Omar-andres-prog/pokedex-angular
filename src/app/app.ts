import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/**
 * Componente raíz de la aplicación.
 * Solo contiene el navbar de navegación y el <router-outlet>
 * que es donde Angular inserta el componente de la ruta activa.
 *
 * RouterLink       → directiva para navegar sin recargar la página (SPA)
 * RouterLinkActive → añade una clase CSS cuando el enlace está activo
 * RouterOutlet     → placeholder donde se renderiza la vista de la ruta actual
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
