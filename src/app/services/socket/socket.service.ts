import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  server_url = "https://159.196.6.181:3000/";
  private socket = io(this.server_url, { secure: true, transports: ['websocket'] });
  current_channel:string = "";

  constructor() { }

  /** Listen for a socket event
   * @param event 
   * @param channel Optional
   * @returns 
   */
  listen_for_event(event:string, channel:string = "") {

    if (channel != "") {
      let newsocket = io(this.server_url, { secure: true, transports: ['websocket'] });
      return new Observable((observer) => {
        newsocket.on(event, (data) => {
          observer.next(data);
        });
      });
    }

    else {
      return new Observable((observer) => {
        this.socket.on(event, (data) => {
          observer.next(data);
        })
      });
    }
  }

  join_channel(channel_name:string) {
    // if (channel_name == this.current_channel) {
      // return;
    // }
    
    // else {
      console.log("else");
      this.emit("unsubscribe", {});
      this.current_channel = channel_name;
      channel_name = channel_name.replace(/\s/g, '-');
      this.socket = io(this.server_url + channel_name, { secure: true, transports: ['websocket'] });
    // }
  }

  emit(event:string, data:any, channel:string = "") {

    if (channel == "admin") {
      let backup_channel:string = this.current_channel;
     
      this.join_channel("admin");
      this.socket.emit(event, data);
      this.join_channel(backup_channel);
    }

    else {
      this.socket.emit(event, data);
    }
  }

}

