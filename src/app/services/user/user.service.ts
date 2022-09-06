import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '../socket/socket.service';

const USER:number = 0;
const GROUP_ASSISTANT:number = 1;
const GROUP_ADMIN:number = 2;
const SUPER_ADMIN:number = 3;

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private socketService:SocketService) { }

  create_user(username:string, email:string, password:string) {
    this.socketService.emit("admin", "create_user", {
      username: username,
      email: email,
      password: password
    });
  }
  
  delete_user(username:string) {
    this.socketService.emit("admin", "delete_user", {
      username: username
    });
  }
  
  set_role(username:string, role:number) {
    this.socketService.emit("admin", "set_role", {
      username: username,
      role: role
    });
  }

  create_group(group_name:string) {
    this.socketService.emit("admin", "create_group", {
      group_name: group_name
    })
  }
  
  delete_group(group_name:string) {
    this.socketService.emit("admin", "delete_group", {
      group_name: group_name
    });
  }
  
  add_user_to_group(user_id:number, group_id:number) {
    this.socketService.emit("admin", "add_user_to_group", {
      user_id: user_id,
      group_id: group_id
    });
  }
  
  remove_user_from_group(username:string, group_name:string) {
    this.socketService.emit("admin", "remove_user_from_group", {
      username: username,
      group_name: group_name
    });
  }
  
  create_channel(channel_name:string, group_name:string) {
    this.socketService.emit("admin", "create_channel", {
      channel_name: channel_name,
      group_name: group_name
    });
  }
  
  delete_channel(channel_name:string, group_name:string) {
    this.socketService.emit("admin", "delete_channel", {
      channel_name: channel_name,
      group_name: group_name
    });
  }
  
  add_user_to_channel(username:string, group_name:string, channel_name:string) {
    this.socketService.emit("admin", "add_user_to_channel", {
      username: username,
      group_name: group_name,
      channel_name: channel_name
    });
  }
  
  remove_user_from_channel(username:string, group_name:string, channel_name:string) {
    this.socketService.emit("admin", "remove_user_from_channel", {
      username: username,
      group_name: group_name,
      channel_name: channel_name
    });
  }
}

export class User {

  username:string;
  email:string;
  password:string = "";
  role:number = USER;

  // Unused, kept here for reference.
  // permissions:Object = {
  //   CREATE_USER: false,
  //   DELETE_USER: false,
    
  //   PROMOTE_TO_ASSISTANT: false,
  //   PROMOTE_TO_ADMIN: false,
  //   PROMOTE_TO_SUPER_ADMIN: false,
    
  //   CREATE_GROUP: false,
  //   DELETE_GROUP: false,
  //   ADD_USER_TO_GROUP: false,
  //   REMOVE_USER_FROM_GROUP: false,

  //   CREATE_CHANNEL: false,
  //   DELETE_CHANNEL: false,
  //   ADD_USER_TO_CHANNEL: false,
  //   REMOVE_USER_FROM_CHANNEL: false
  // };
  
  constructor(username:string, email:string) {
    this.username = username;
    this.email = email;
  }
}

