import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class PeerService {

  peer_id = uuidv4();
  peer_instance:any;
  username:string = "";

  constructor(private userService:UserService) {
    this.peer_instance = new Peer(this.peer_id, {
      host: "127.0.0.1",
      secure: true,
      port: 3001,
      path: "/"
    });
  }

  // Store peer id for user in database
  update_peer_id() {
    // Get info of logged in user
    this.username = JSON.parse(String(localStorage.getItem("user_info")))?.username;

    const API_URL = `http://127.0.0.1:3000/api/users/${this.username}/peer_id`;
    this.userService.update_peer_id(this.username, this.peer_id);
  }
}

