import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Menu } from '../models/Menu';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  url: string = environment.ApiURL;
  demo$ = new EventEmitter<boolean>();

  constructor() {}

  fnServiceMenu(nOpcion: number, pParametro: any): Observable<Menu[]> {
    const mockMenu: Menu[] = [
      {
        idMenu: 1,
        name: 'Usuarios',
        route: 'users',
        icon: 'people',
        idParent: 0,
        status: true,
        show: false,
        subMenu: [],
        level: 1
      },
      {
        idMenu: 2,
        name: 'Inventario',
        route: 'inventory',
        icon: 'inventory',
        idParent: 0,
        status: true,
        show: false,
        subMenu: [],
        level: 1
      }
    ];

    // simulamos una respuesta inmediata
    return of(mockMenu);
  }
}

