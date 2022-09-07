import { Injectable } from '@angular/core';
import { Subject, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme = new Subject<string>();

  constructor() { }

  set_theme(theme:string) {
    localStorage.setItem("theme", theme);
    this.theme.next(theme);
  }

  get_theme() {
    return this.theme;
  }

}
