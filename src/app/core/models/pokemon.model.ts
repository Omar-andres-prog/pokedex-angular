/**
 * Interfaces TypeScript que modelan las respuestas de la PokéAPI.
 * Tener tipos explícitos evita el uso de 'any' y activa el autocompletado.
 * Documentación de la API: https://pokeapi.co/docs/v2
 */

/** Respuesta del endpoint /pokemon?limit=N&offset=M */
export interface PokemonListResponse {
  count: number;           // Total de Pokémon en la base de datos
  next: string | null;     // URL de la siguiente página (null si es la última)
  previous: string | null; // URL de la página anterior (null si es la primera)
  results: PokemonListItem[];
}

/** Elemento del listado: solo nombre y URL del detalle */
export interface PokemonListItem {
  name: string;
  url: string; // Ej: "https://pokeapi.co/api/v2/pokemon/25/"
}

/** Respuesta completa del endpoint /pokemon/:id */
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;          // En decímetros (divide entre 10 para metros)
  weight: number;          // En hectogramos (divide entre 10 para kg)
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStatSlot[];
  abilities: PokemonAbilitySlot[];
}

/** Imágenes del Pokémon */
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    // Nota: la propiedad tiene guion en el JSON original de la API
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

/** Slot de tipo: un Pokémon puede tener hasta 2 tipos */
export interface PokemonTypeSlot {
  slot: number; // 1 = tipo principal, 2 = secundario
  type: NamedResource;
}

/** Slot de estadística base */
export interface PokemonStatSlot {
  base_stat: number; // Valor base (0-255)
  effort: number;    // Puntos de esfuerzo (EV)
  stat: NamedResource;
}

/** Slot de habilidad */
export interface PokemonAbilitySlot {
  ability: NamedResource;
  is_hidden: boolean; // Las habilidades ocultas son especiales
  slot: number;
}

/** Patrón genérico de la API: objeto con nombre y URL */
export interface NamedResource {
  name: string;
  url: string;
}

/**
 * Mapa de colores por tipo de Pokémon.
 * Se usa para dar color a las tarjetas y badges de tipo.
 * Record<string, string> es equivalente a { [key: string]: string }
 */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};
