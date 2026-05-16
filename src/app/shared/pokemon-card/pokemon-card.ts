import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

import { PokemonDetail, TYPE_COLORS } from '../../core/models/pokemon.model';

/**
 * Tarjeta reutilizable para mostrar un Pokémon.
 * Se usa tanto en Dashboard como en el resultado de búsqueda.
 *
 * Al ser standalone, declara sus propias dependencias en 'imports'
 * sin necesidad de un NgModule.
 *
 * @Input() permite recibir datos desde el componente padre:
 * <app-pokemon-card [pokemon]="miPokemon" />
 */
@Component({
  selector: 'app-pokemon-card',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCard {
  // required: true → error en compilación si el padre no lo provee
  @Input({ required: true }) pokemon!: PokemonDetail;

  /** Devuelve el color del tipo principal para el fondo de la tarjeta */
  getTypeColor(): string {
    // El '?? normal' garantiza que primaryType sea siempre string, nunca undefined
    const primaryType: string = this.pokemon.types[0]?.type.name ?? 'normal';
    return TYPE_COLORS[primaryType] ?? TYPE_COLORS['normal'];
  }

  /** Formatea el ID con ceros a la izquierda: 1 → '#001' */
  get formattedId(): string {
    return `#${String(this.pokemon.id).padStart(3, '0')}`;
  }

  /**
   * Obtiene la URL de la imagen oficial.
   * La API tiene varios sprites; priorizamos el artwork oficial de alta calidad.
   * La notación ['official-artwork'] es necesaria porque el nombre tiene guion.
   */
  get imageUrl(): string {
    return (
      this.pokemon.sprites.other?.['official-artwork']?.front_default ??
      this.pokemon.sprites.front_default ??
      ''
    );
  }
}
