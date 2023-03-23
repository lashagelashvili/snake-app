import { Component, OnInit } from '@angular/core';
import {
  distinctUntilChanged,
  fromEvent,
  interval,
  Subject,
  takeUntil,
  tap,
  map as rxMap,
  merge,
} from 'rxjs';
import { Snake, Map, Tile, Direction, SnakePart, Food } from './model';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
})
export class SnakeComponent implements OnInit {
  size = 20;
  grid: Tile[][] = [];
  snake: Snake;

  snake_body: Tile = {
    isFood: false,
    isSnake: true,
    isHead: false,
  };

  snake_head: Tile = {
    isFood: false,
    isSnake: false,
    isHead: true,
  };

  food: Tile = {
    isFood: true,
    isSnake: false,
    isHead: false,
  };

  gameRunning$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    let snake = this.defaultSnake();
    let map = this.defaultMap();
    let food = this.defaultFood();
    this.grid = this.updateMap(snake, map, food); // default

    // this.generateFood();

    let direction$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      distinctUntilChanged(
        (a, b) => a === b,
        (event: KeyboardEvent) => event.key
      ),
      rxMap((event) => event.key),
      tap((direction) => (snake.direction = direction as Direction))
    );

    let tick$ = interval(400).pipe(
      tap((_) => {
        this.grid = this.updateMap(
          this.moveSnake(snake),
          this.defaultMap(),
          food
        );
      })
    );

    let game$ = merge(direction$, tick$);

    game$.pipe(takeUntil(this.gameRunning$)).subscribe();
  }

  defaultMap() {
    let map: Tile[][] = [];
    for (let i = 0; i < this.size; i++) {
      map[i] = [];
      for (let j = 0; j < this.size; j++) {
        map[i][j] = { isSnake: false, isHead: false, isFood: false };
      }
    }
    return map;
  }

  defaultSnake() {
    let direction = Direction.RIGHT;
    let body = [
      { i: 0, j: 0 },
      { i: 0, j: 1 },
      { i: 0, j: 2 },
    ];
    let head = { i: 0, j: 3 };

    let defaultSnake: Snake = {
      body,
      head,
      direction,
    };

    return defaultSnake;
  }

  moveSnake(snake: Snake) {
    let lastHead = snake.head;
    let newHead = this.changeDirection(lastHead, snake.direction);

    if (newHead.j > 19) {
      console.log('you lost');
      this.gameRunning$.next();
      return snake; // reurn last state
    } else if (newHead.j < 0) {
      this.gameRunning$.next();
      return snake;
    } else if (newHead.i > 19) {
      this.gameRunning$.next();
      return snake;
    } else if (newHead.i < 0) {
      this.gameRunning$.next();
      return snake;
    }

    snake.body.shift();
    snake.body.push(lastHead);

    snake.head = newHead;

    return snake;
  }

  changeDirection(head: SnakePart, direction: Direction) {
    let newHead: SnakePart = { i: 0, j: 0 };

    if (direction === 'ArrowDown') {
      newHead = {
        i: head.i + 1,
        j: head.j,
      };
    } else if (direction === 'ArrowRight') {
      newHead = {
        i: head.i,
        j: head.j + 1,
      };
    } else if (direction === 'ArrowUp') {
      newHead = {
        i: head.i - 1,
        j: head.j,
      };
    } else {
      newHead = {
        i: head.i,
        j: head.j - 1,
      };
    }

    return newHead;
  }

  updateMap(snake: Snake, map: Tile[][], food: Food) {
    snake.body.forEach((part) => {
      map[part.i][part.j] = this.snake_body;
    });

    map[snake.head.i][snake.head.j] = this.snake_head;
    map[food.i][food.j] = this.food;

    return map;
  }

  defaultFood(): Food {
    return { i: 10, j: 10 };
  }

  generateFood() {
    let i = Math.floor(Math.random() * 20);
    let j = Math.floor(Math.random() * 20);

    this.grid[i][j] = this.food;
  }

  trackByIndex(index: number) {
    return index;
  }
}
