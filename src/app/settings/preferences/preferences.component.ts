import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  current_theme:string = "light";

  constructor(private themeService:ThemeService) {

  }

  ngOnInit(): void {

  }

  set_theme(theme:string) {
    this.current_theme = theme;
    this.themeService.set_theme(theme);
  }

}
