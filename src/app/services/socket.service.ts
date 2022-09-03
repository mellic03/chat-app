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

  send(message:object) {
    this.socket.emit("message", message);
  }

  getMessage() {
    return new Observable(observer => {
      this.socket.on("message", (data) => {
        observer.next(data);
      })
    })
  }

}