import { Component, OnInit } from '@angular/core';
import { PeerService } from 'src/app/services/peer/peer.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  current_theme:string;

  video_streams:Array<any> = [];

  constructor(private themeService:ThemeService,
              private peerService:PeerService) {
    this.current_theme = String(localStorage.getItem("theme"));
  }

  add_local_stream(stream:MediaStream) {
    this.video_streams.push({
      muted: true,
      stream: stream,
      user_id: this.peerService.peer_id 
    });
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
    }).then((stream) => {
      this.add_local_stream(stream);
    
      this.peerService.peer_instance.on("call", (call:any) => {
        console.log(`Recieving call: ${call}`);
        call.answer(stream);
        call.on("stream", (other_user_stream:MediaStream) => {
          this.add_other_stream(call.metadata.user_id, other_user_stream);
        });
      });
      
    });
  
  }

  // Set the current theme
  set_theme(theme:string) {
    this.current_theme = theme;
    this.themeService.set_theme(theme);
  }

}
