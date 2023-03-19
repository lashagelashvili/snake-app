import { Component, OnInit } from '@angular/core';
import { catchError, interval, of, tap } from 'rxjs';
import { Snake, Map, Tile, SnakePart } from './model';

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

  constructor() {}

  ngOnInit(): void {
    // this.grid = this.defaultMap();
    interval(1000).pipe(
      tap((num) => {
        this.grid = this.updateMap(this.defaultSnake(), this.defaultMap());
        // this.grid[0][num + 3].isSnake = true;
        // this.grid[0][num + 3].isHead = true;

        // this.grid[0][num].isSnake = false;
        // this.grid[0][num + 2].isHead = false;
      }),
      catchError((err) => {
        throw err;
      })
    );
    // .subscribe();
  }

  defaultMap() {
    let map: Tile[][] = [];
    for (let i = 0; i < this.size; i++) {
      map[i] = [];
      for (let j = 0; j < this.size; j++) {
        map[i][j] = { isSnake: false, isHead: false, isFood: false };
      }
    }
    console.log(map);
    return map;
  }

  defaultSnake() {
    let body = [
      { i: 0, j: 0 },
      { i: 0, j: 1 },
      { i: 0, j: 2 },
    ];

    let head = { i: 0, j: 3 };

    let defaultSnake: Snake = {
      body,
      head,
    };

    return defaultSnake;
  }

  updateMap(snake: Snake, map: Tile[][]) {
    snake.body.forEach((part) => {
      map[part.i][part.j] = this.snake_body;
    });

    map[snake.head.i][snake.head.j] = this.snake_head;

    return map;
  }

  trackByIndex(index: number) {
    return index;
  }
}
