import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

import { PokemonService } from '../../core/services/pokemon';
import { PokemonDetail, TYPE_COLORS } from '../../core/models/pokemon.model';

/**
 * Vista de detalle de un Pokémon individual.
 * Lee el parámetro ':id' de la URL para saber qué Pokémon cargar.
 *
 * ActivatedRoute: servicio de Angular que da acceso a la información
 * de la ruta activa (parámetros, query params, datos, etc.)
 */
@Component({
  selector: 'app-detail',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pokemonService = inject(PokemonService);

  readonly pokemon = signal<PokemonDetail | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);

  ngOnInit(): void {
    /**
     * paramMap.get('id') devuelve string | null (100% tipado, sin 'any').
     * snapshot: lectura en un instante concreto. Suficiente aquí porque
     * siempre navegamos a una URL distinta para cada Pokémon.
     */
    const id: string = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadPokemon(id);
  }

  private loadPokemon(id: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.pokemon.set(null);

    this.pokemonService.getPokemonDetail(id).subscribe({
      next: (data: PokemonDetail) => {
        this.pokemon.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  /** Devuelve el color del tipo para los badges */
  getTypeColor(typeName: string): string {
    return TYPE_COLORS[typeName] ?? TYPE_COLORS['normal'];
  }

  /** Color del tipo principal para el fondo del encabezado */
  get primaryColor(): string {
    const p: PokemonDetail | null = this.pokemon();
    if (!p || p.types.length === 0) return '#A8A878';
    return TYPE_COLORS[p.types[0].type.name] ?? '#A8A878';
  }

  get imageUrl(): string {
    const p: PokemonDetail | null = this.pokemon();
    if (!p) return '';
    return (
      p.sprites.other?.['official-artwork']?.front_default ??
      p.sprites.front_default ??
      ''
    );
  }

  get formattedId(): string {
    const p: PokemonDetail | null = this.pokemon();
    return p ? `#${String(p.id).padStart(3, '0')}` : '';
  }

  /** Decímetros → metros con 1 decimal: 7 → "0.7 m" */
  formatHeight(height: number): string {
    return `${(height / 10).toFixed(1)} m`;
  }

  /** Hectogramos → kilogramos con 1 decimal: 69 → "6.9 kg" */
  formatWeight(weight: number): string {
    return `${(weight / 10).toFixed(1)} kg`;
  }

  /**
   * Convierte el base_stat a porcentaje sobre el máximo posible (255).
   * Se usa para la anchura de las barras de progreso de las estadísticas.
   */
  statPercent(baseStat: number): number {
    return Math.round((baseStat / 255) * 100);
  }

  /**
   * Formatea el nombre de la stat para mostrarlo de forma legible.
   * Ej: 'special-attack' → 'Sp. Atk'
   */
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
}
