import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  server_url = "http://159.196.6.181:3000/";
  private socket = io(this.server_url, { transports: ['websocket'] });
  constructor() { }

  listen_for_event(event:string) {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      })
    });
  }

  join_channel(channel_name:string) {
    this.socket = io(this.server_url + channel_name, { transports: ['websocket'] });
  }

  emit(channel_name:string, event:string, data:Object) {
    this.join_channel(channel_name);
    this.socket.emit(event, data);
  }

}
