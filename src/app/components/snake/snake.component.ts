import { Component, OnInit } from '@angular/core';
import { Snake } from './model';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
})
export class SnakeComponent implements OnInit {
  size = 20;
  grid: Snake[] = new Array(this.size * this.size)
    .fill({} as Snake)
    .map(() => ({ isSnake: false, isFood: false, isHead: false }));

  ngOnInit(): void {
    this.initialState();
    console.log(this.grid);
  }

  initialState() {
    for (let i = 0; i < 3; i++) {
      this.grid[i].isSnake = true;
      console.log('a');
    }
  }

  startGame() {}
}
