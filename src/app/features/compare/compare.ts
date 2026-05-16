import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { PokemonService } from '../../core/services/pokemon';
import { PokemonDetail, TYPE_COLORS } from '../../core/models/pokemon.model';

/**
 * PUNTO EXTRA (1 pt): Comparador de dos Pokémon.
 * Permite buscar dos Pokémon por nombre y ver sus estadísticas
 * lado a lado, destacando cuál gana en cada stat.
 *
 * También acepta el query param '?a=pikachu' desde el botón "Comparar"
 * en la vista de detalle, prellenando el primer slot.
 */
@Component({
  selector: 'app-compare',
  imports: [FormsModule, TitleCasePipe, RouterLink],
  templateUrl: './compare.html',
  styleUrl: './compare.scss',
})
export class Compare implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly route = inject(ActivatedRoute);

  // Término de búsqueda de cada slot (enlazado al input con ngModel)
  searchA: string = '';
  searchB: string = '';

  // Estado de cada slot: el Pokémon cargado, si está cargando, y si hay error
  readonly pokemonA = signal<PokemonDetail | null>(null);
  readonly pokemonB = signal<PokemonDetail | null>(null);
  readonly loadingA = signal<boolean>(false);
  readonly loadingB = signal<boolean>(false);
  readonly errorA = signal<string>('');
  readonly errorB = signal<string>('');

  ngOnInit(): void {
    // Si se llega desde el detalle con ?a=pikachu, prellenar el slot A
    const nameFromQuery = this.route.snapshot.queryParamMap.get('a');
    if (nameFromQuery) {
      this.searchA = nameFromQuery;
      this.loadPokemonA();
    }
  }

  loadPokemonA(): void {
    this.loadSlot(this.searchA, this.pokemonA, this.loadingA, this.errorA);
  }

  loadPokemonB(): void {
    this.loadSlot(this.searchB, this.pokemonB, this.loadingB, this.errorB);
  }

  /**
   * Método genérico para cargar un Pokémon en cualquier slot.
   * Usa WritableSignal<T> como tipo para poder llamar a .set() y .update().
   * Esto evita duplicar el código para el slot A y el B.
   */
  private loadSlot(
    term: string,
    resultSignal: WritableSignal<PokemonDetail | null>,
    loadingSignal: WritableSignal<boolean>,
    errorSignal: WritableSignal<string>
  ): void {
    if (!term.trim()) return;

    loadingSignal.set(true);
    errorSignal.set('');
    resultSignal.set(null);

    this.pokemonService.searchPokemon(term).subscribe({
      next: (pokemon: PokemonDetail) => {
        resultSignal.set(pokemon);
        loadingSignal.set(false);
      },
      error: () => {
        errorSignal.set(`No encontrado: "${term}"`);
        loadingSignal.set(false);
      },
    });
  }

  /** Devuelve el color del tipo de un Pokémon */
  getTypeColor(pokemon: PokemonDetail): string {
    const primaryType: string = pokemon.types[0]?.type.name ?? 'normal';
    return TYPE_COLORS[primaryType] ?? TYPE_COLORS['normal'];
  }

  getImageUrl(pokemon: PokemonDetail): string {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ??
      pokemon.sprites.front_default ??
      ''
    );
  }

  /**
   * Devuelve 'a' si el Pokémon A gana en esa stat, 'b' si gana B,
   * o 'equal' si empatan. Se usa para resaltar el ganador visualmente.
   */
  getWinner(statName: string): 'a' | 'b' | 'equal' {
    const a: PokemonDetail | null = this.pokemonA();
    const b: PokemonDetail | null = this.pokemonB();
    if (!a || !b) return 'equal';

    const statA: number = a.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
    const statB: number = b.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;

    if (statA > statB) return 'a';
    if (statB > statA) return 'b';
    return 'equal';
  }

  /** Obtiene el valor de una stat específica de un Pokémon */
  getStat(pokemon: PokemonDetail, statName: string): number {
    return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
  }

  /** Porcentaje del valor de stat sobre el máximo posible (255) */
  statPercent(value: number): number {
    return Math.round((value / 255) * 100);
  }

  /** Nombres legibles de las stats */
  formatStatName(statName: string): string {
    const names: Record<string, string> = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'Sp. Atq',
      'special-defense': 'Sp. Def',
      speed: 'Velocidad',
    };
    return names[statName] ?? statName;
  }

  // Las 6 stats estándar de la API en orden
  readonly STAT_NAMES: string[] = [
    'hp',
    'attack',
    'defense',
    'special-attack',
    'special-defense',
    'speed',
  ];
}
