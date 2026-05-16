import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

import { PokemonDetail, PokemonListResponse } from '../models/pokemon.model';

/**
 * Servicio encargado de TODAS las llamadas a la PokéAPI.
 * Separar la lógica HTTP del componente es el principio de responsabilidad única (SOLID).
 *
 * providedIn: 'root' → Angular crea una única instancia compartida (Singleton) en toda la app.
 */
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly BASE_URL: string = 'https://pokeapi.co/api/v2';

  /**
   * inject() es la forma moderna de inyectar dependencias en Angular (desde v14).
   * Es equivalente a declarar el parámetro en el constructor.
   */
  private readonly http = inject(HttpClient);

  // Limitamos los aleatorios a las 8 primeras generaciones (IDs 1-898)
  private readonly TOTAL_POKEMON: number = 898;

  /**
   * Obtiene una página del listado completo.
   * @param limit  Cuántos Pokémon devolver (20 para la paginación)
   * @param offset Desde qué posición empezar (página × limit)
   */
  getPokemonList(limit: number, offset: number): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Obtiene el detalle completo de un Pokémon por ID o nombre exacto.
   * La API acepta tanto número (25) como nombre ('pikachu').
   */
  getPokemonDetail(nameOrId: string | number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.BASE_URL}/pokemon/${nameOrId}`);
  }

  /**
   * Genera N Pokémon completamente aleatorios y únicos.
   *
   * forkJoin: operador de RxJS que recibe un array de Observables y espera
   * a que TODOS completen, emitiendo un array con los resultados en orden.
   * Es ideal para peticiones paralelas independientes.
   */
  getRandomPokemons(count: number): Observable<PokemonDetail[]> {
    const ids: number[] = this.randomUniqueIds(count, this.TOTAL_POKEMON);
    return forkJoin(ids.map((id: number) => this.getPokemonDetail(id)));
  }

  /**
   * Busca un Pokémon por nombre exacto.
   * Nota: la PokéAPI NO soporta búsqueda parcial ni por wildcards.
   * 'pikachu' funciona, 'pika' devuelve 404.
   */
  searchPokemon(name: string): Observable<PokemonDetail> {
    return this.getPokemonDetail(name.toLowerCase().trim());
  }

  /** Genera `count` enteros únicos aleatorios en [1, max] sin repetición */
  private randomUniqueIds(count: number, max: number): number[] {
    const ids = new Set<number>();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(ids);
  }
}
