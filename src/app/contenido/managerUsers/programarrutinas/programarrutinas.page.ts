import { Component, OnInit,HostListener  } from '@angular/core';


@Component({
  selector: 'app-programarrutinas',
  templateUrl: './programarrutinas.page.html',
  styleUrls: ['./programarrutinas.page.scss'],
})
export class ProgramarrutinasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  squareWidth: number = 300; // Ancho del cuadrado
  circleRadius: number = 25; // Radio del círculo
  circleX: number = this.circleRadius; // Inicialmente en el centro del cuadrado
  circleY: number = this.squareWidth / 2; // Inicialmente en el centro del cuadrado

  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    const newPositionX = touch.clientX - this.circleRadius; // Restar el radio para ajustar la posición
    this.updateCirclePosition(newPositionX, this.circleY);
  }

  private updateCirclePosition(x: number, y: number) {
    // Restringir el movimiento dentro del cuadrado
    if (x < this.circleRadius) {
      this.circleX = this.circleRadius;
    } else if (x > this.squareWidth - this.circleRadius) {
      this.circleX = this.squareWidth - this.circleRadius;
    } else {
      this.circleX = x;
    }
    this.circleY = y;
    console.log(this.circleX,this.circleY)
  }
}
