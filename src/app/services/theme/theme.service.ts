import { Injectable } from '@angular/core';
import { Subject, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme = new Subject<string>();

  constructor() { }

  set_theme(theme:string) {
    this.theme.next(theme);
  }

}
