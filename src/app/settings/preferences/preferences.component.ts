import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  current_theme:string;
  media_stream:MediaStream = new MediaStream();

  constructor(private themeService:ThemeService) {
    this.current_theme = String(localStorage.getItem("theme"));
  }

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      this.media_stream = stream;
    });
  }

  set_theme(theme:string) {
    this.current_theme = theme;
    this.themeService.set_theme(theme);
  }


}
