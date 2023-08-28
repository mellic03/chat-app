import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  current_theme:string;

  video_streams:Array<any> = [];

  constructor(private themeService:ThemeService) {
    this.current_theme = String(localStorage.getItem("theme"));
  }

  add_other_stream(user_id:string, stream:MediaStream) {
    const already_streaming = this.video_streams.some(video => {video.user_id === user_id});
    if (already_streaming) {
      console.log(this.video_streams, user_id);
      return;
    }
    this.video_streams.push({
      muted: false,
      stream: stream,
      user_id: user_id
    });
  }

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({
      audio: false,  
      video: true
    });
  
  }

  // Set the current theme
  set_theme(theme:string) {
    this.current_theme = theme;
    this.themeService.set_theme(theme);
  }

}
