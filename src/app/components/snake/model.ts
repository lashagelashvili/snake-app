export interface Snake {
  body: SnakePart[];
  head: SnakePart;
}

export interface Map {
  grid: Tile[][];
}

export interface Tile {
  isFood: boolean;
  isHead: boolean;
  isSnake: boolean;
}

export interface SnakePart {
  i: number;
  j: number;
}
