import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Configuración global de la aplicación Angular (standalone).
 * En la arquitectura moderna no existe AppModule; la configuración
 * se centraliza aquí y se pasa a bootstrapApplication() en main.ts.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),     // Activa el sistema de routing con nuestras rutas
    provideHttpClient(),       // Habilita HttpClient en toda la aplicación (requerido por el servicio)
  ],
};
