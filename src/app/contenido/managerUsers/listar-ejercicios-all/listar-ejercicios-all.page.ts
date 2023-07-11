import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
@Component({
  selector: 'app-listar-ejercicios-all',
  templateUrl: './listar-ejercicios-all.page.html',
  styleUrls: ['./listar-ejercicios-all.page.scss'],
})
export class ListarEjerciciosAllPage implements OnInit {

  constructor() { }
  items: string[] = [];

  ngOnInit() {
    this.generateItems();
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 16; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(ev:any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 3000);
  }
}
