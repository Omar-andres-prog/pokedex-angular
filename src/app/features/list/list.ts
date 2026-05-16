import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

import { PokemonService } from '../../core/services/pokemon';
import { PokemonListItem, PokemonListResponse } from '../../core/models/pokemon.model';

/**
 * Listado paginado de todos los Pokémon.
 * Muestra 20 por página con controles de navegación.
 *
 * computed(): Signal de solo lectura que recalcula su valor automáticamente
 * cada vez que cambian las Signals de las que depende.
 */
@Component({
  selector: 'app-list',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  private readonly pokemonService = inject(PokemonService);

  readonly PAGE_SIZE: number = 20;

  readonly pokemons = signal<PokemonListItem[]>([]);
  readonly totalCount = signal<number>(0);
  readonly currentPage = signal<number>(0); // 0-indexed para facilitar el cálculo del offset
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);

  // computed() recalcula automáticamente cuando cambia totalCount o currentPage
  readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.PAGE_SIZE));
  readonly hasPrev = computed(() => this.currentPage() > 0);
  readonly hasNext = computed(() => this.currentPage() < this.totalPages() - 1);

  ngOnInit(): void {
    this.loadPage(0);
  }

  /** Carga la página indicada. offset = página × tamaño de página */
  loadPage(page: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const offset: number = page * this.PAGE_SIZE;

    this.pokemonService.getPokemonList(this.PAGE_SIZE, offset).subscribe({
      next: (response: PokemonListResponse) => {
        this.pokemons.set(response.results);
        this.totalCount.set(response.count); // La API nos dice el total real
        this.currentPage.set(page);
        this.isLoading.set(false);
        // Vuelve al inicio de la lista al cambiar de página
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  nextPage(): void {
    if (this.hasNext()) this.loadPage(this.currentPage() + 1);
  }

  prevPage(): void {
    if (this.hasPrev()) this.loadPage(this.currentPage() - 1);
  }

  /**
   * Extrae el ID del Pokémon desde su URL de la API.
   * La URL tiene este formato: 'https://pokeapi.co/api/v2/pokemon/25/'
   * Dividimos por '/', filtramos vacíos y cogemos el último segmento.
   */
  getIdFromUrl(url: string): number {
    const segments: string[] = url.split('/').filter(Boolean);
    return parseInt(segments[segments.length - 1], 10);
  }

  /** Formatea el ID con ceros: 25 → '#025' */
  formatId(id: number): string {
    return `#${String(id).padStart(3, '0')}`;
  }
}
