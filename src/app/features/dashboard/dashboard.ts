import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PokemonService } from '../../core/services/pokemon';
import { PokemonDetail } from '../../core/models/pokemon.model';
import { PokemonCard } from '../../shared/pokemon-card/pokemon-card';

/**
 * Vista principal de la Pokédex.
 * Muestra 10 Pokémon aleatorios y permite buscar por nombre.
 *
 * OnInit: ciclo de vida de Angular → ngOnInit() se ejecuta
 * justo después de que Angular crea el componente e inyecta inputs.
 */
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, PokemonCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly pokemonService = inject(PokemonService);

  // ── Estado del grid de aleatorios (Signals) ──────────────────
  // signal<T>: valor reactivo → cuando cambia, Angular actualiza la vista automáticamente
  readonly pokemons = signal<PokemonDetail[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);

  // ── Estado de la búsqueda ─────────────────────────────────────
  // Propiedad normal para el two-way binding de ngModel en el input
  searchTerm: string = '';
  readonly searchResult = signal<PokemonDetail | null>(null);
  readonly isSearching = signal<boolean>(false);
  readonly searchError = signal<string>('');

  /** Se ejecuta una vez al crear el componente */
  ngOnInit(): void {
    this.loadRandomPokemons();
  }

  /**
   * Carga 10 Pokémon aleatorios usando el servicio.
   * Se llama en ngOnInit y también al pulsar el botón "Recargar".
   * Cada vez genera IDs distintos → los Pokémon son diferentes en cada carga.
   */
  loadRandomPokemons(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.clearSearch();

    // subscribe: nos "suscribimos" al Observable para recibir el resultado
    // next: se ejecuta cuando llegan los datos correctamente
    // error: se ejecuta si la petición HTTP falla
    this.pokemonService.getRandomPokemons(10).subscribe({
      next: (result: PokemonDetail[]) => {
        this.pokemons.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Busca un Pokémon por nombre exacto al enviar el formulario.
   * La PokéAPI no permite búsquedas parciales: 'pikach' → 404.
   */
  onSearch(): void {
    const term: string = this.searchTerm.trim();
    if (!term) return;

    this.isSearching.set(true);
    this.searchError.set('');
    this.searchResult.set(null);

    this.pokemonService.searchPokemon(term).subscribe({
      next: (pokemon: PokemonDetail) => {
        this.searchResult.set(pokemon);
        this.isSearching.set(false);
      },
      error: () => {
        this.searchError.set(`No se encontró ningún Pokémon llamado "${term}". Recuerda: la búsqueda es por nombre exacto.`);
        this.isSearching.set(false);
      },
    });
  }

  /** Limpia el estado de la búsqueda */
  clearSearch(): void {
    this.searchTerm = '';
    this.searchResult.set(null);
    this.searchError.set('');
  }
}
