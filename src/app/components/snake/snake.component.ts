import { Component, OnInit } from '@angular/core';
import { interval, tap } from 'rxjs';
import { Snake } from './model';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
})
export class SnakeComponent implements OnInit {
  size = 20;
  grid: Snake[][] = [];
  // grid: Snake[][] = new Array(this.size * this.size)
  //   .fill({} as Snake)
  //   .map(() => ({ isSnake: false, isFood: false, isHead: false }));

  constructor() {}

  ngOnInit(): void {
    this.createMap();
    // this.initialState();
    // console.log(this.grid);
    // interval(700).subscribe((num) => {
    //   console.log(num);
    //   let lastCell = this.grid[num];
    //   let currentHead = this.grid[num + 2];
    //   let nextCell = this.grid[num + 3];
    //   // currentHead.isHead = true;
    //   this.grid[num + 3] = { ...this.grid[num], isHead: true };
    //   this.grid[num + 2].isHead = false;
    //   this.grid[num].isSnake = false;
    //   this.grid[num].isHead = false;
    //   // nextCell = { ...lastCell, isHead: true };
    //   // lastCell.isSnake = false;
    //   // currentHead.isHead = false;
    // });
  }

  createMap() {
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = { isSnake: false, isHead: false, isFood: false };
      }
    }
  }

  // initialState() {
  //   for (let i = 0; i < 3; i++) {
  //     if (i === 2) {
  //       this.grid[i].isHead = true;
  //       this.grid[i].isSnake = true;
  //       return;
  //     }

  //     this.grid[i].isSnake = true;
  //   }
  // }

  // public trackItem(index: number, item: any) {
  //   return item.isHead;
  // }
}

// this.grid = [
//   [
//     { isSnake: true, isHead: false, isFood: false },
//     { isSnake: true, isHead: false, isFood: false },
//     { isSnake: true, isHead: false, isFood: false },
//     { isSnake: true, isHead: false, isFood: false },
//     { isSnake: true, isHead: false, isFood: false },
//     { isSnake: false, isHead: false, isFood: false },
//     { isSnake: false, isHead: false, isFood: false },
//     { isSnake: false, isHead: false, isFood: false },
//   ],
//   [],
//   [],
//   [],
//   [],
// ];
