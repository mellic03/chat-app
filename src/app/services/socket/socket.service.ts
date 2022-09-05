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


  // Messaging
  //-------------------------------------------
  join_channel(channel_name:string) {
    this.socket = io(this.server_url + channel_name, { transports: ['websocket'] });
  }

  emit(title:string, data:Object) {
    this.socket.emit(title, data);
  }

  connect() {
    return new Observable(observer => {
      this.socket.on("message", data => {
        observer.next(data);
      });
    })
  }
  
  disconnect() {
    this.socket.emit("unsubscribe", {});
  }
  //-------------------------------------------
}
