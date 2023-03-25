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
  BehaviorSubject,
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

  defaultFood: Food = { i: 10, j: 10 };

  food$ = new BehaviorSubject<any>(this.defaultFood);

  gameRunning$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    let snake = this.defaultSnake();
    let food!: Food;
    this.food$.subscribe((res) => (food = res));

    let direction$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      distinctUntilChanged(
        (a, b) => a === b,
        (event: KeyboardEvent) => event.key
      ),
      rxMap((event) => event.key),
      tap((direction) => {
        let canMove = this.canMove(snake.direction, direction as Direction);

        if (canMove) {
          snake.direction = direction as Direction;
        }
      })
    );

    let tick$ = interval(200).pipe(
      tap((_) => {
        this.grid = this.updateMap(
          this.moveSnake(snake, food),
          this.defaultMap(),
          food
        );
      })
    );

    let game$ = merge(direction$, tick$);

    game$.pipe(takeUntil(this.gameRunning$)).subscribe();
  }

  defaultMap() {
    const map: Tile[][] = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => ({
        isSnake: false,
        isHead: false,
        isFood: false,
      }))
    );

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
    let length = body.length;

    let defaultSnake: Snake = {
      body,
      head,
      direction,
      length,
    };

    return defaultSnake;
  }

  moveSnake(snake: Snake, food: Food) {
    let lastHead = snake.head;
    let newHead = this.changeDirection(lastHead, snake.direction);

    if (
      snake.body.some((part) => part.i === newHead.i && part.j === newHead.j)
    ) {
      this.gameRunning$.next();
    }

    if (newHead.j > 19) {
      this.gameRunning$.next();
      return snake;
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

    if (snake.head.i === food.i && snake.head.j === food.j) {
      snake.length++;
      this.food$.next(true);
      snake.body.push(lastHead);
      snake.head = newHead;
      let food = this.generateFood();
      this.food$.next(food);

      return snake;
    } else {
      snake.body.shift();
      snake.body.push(lastHead);

      snake.head = newHead;

      return snake;
    }
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

  generateFood() {
    let i = Math.floor(Math.random() * 20);
    let j = Math.floor(Math.random() * 20);

    return { i, j };
  }

  canMove(currentDirection: Direction, nextDirection: Direction) {
    switch (currentDirection) {
      case Direction.RIGHT:
        return nextDirection !== Direction.LEFT;

      case Direction.DOWN:
        return nextDirection !== Direction.UP;

      case Direction.LEFT:
        return nextDirection !== Direction.RIGHT;

      case Direction.UP:
        return nextDirection !== Direction.DOWN;
    }
  }

  trackByIndex(index: number) {
    return index;
  }
}
