export interface Snake {
  body: SnakePart[];
  head: SnakePart;
  direction: Direction;
}

export enum Direction {
  UP = 'ArrowUp',
  RIGHT = 'ArrowRight',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
}

export interface Map {
  grid: Tile[][];
}

export interface Tile {
  isFood: boolean;
  isHead: boolean;
  isSnake: boolean;
}

export interface Food {
  i: number;
  j: number;
}

export interface SnakePart {
  i: number;
  j: number;
}
