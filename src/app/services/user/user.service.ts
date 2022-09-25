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

  current_user = new Subject<User>();

  constructor(private socketService:SocketService) { }

  create_user(username:string, email:string, password:string) {
    this.socketService.emit("create_user", {
      username: username,
      email: email,
      password: password
    }, "admin");
  }
  
  delete_user(username:string) {
    this.socketService.emit("delete_user", {
      username: username
    }, "admin");
  }
  
  set_role(username:string, role:number) {
    this.socketService.emit("set_role", {
      username: username,
      role: role
    }, "admin");
  }

  create_group(group_name:string) {
    this.socketService.emit("create_group", {
      group_name: group_name
    }, "admin")
  }
  
  delete_group(group_name:string) {
    this.socketService.emit("delete_group", {
      group_name: group_name
    }, "admin");
  }
  
  add_user_to_group(user_id:number, group_id:number) {
    this.socketService.emit("add_user_to_group", {
      user_id: user_id,
      group_id: group_id
    }, "admin");
  }
  
  remove_user_from_group(username:string, group_name:string) {
    this.socketService.emit("remove_user_from_group", {
      username: username,
      group_name: group_name
    }, "admin");
  }
  
  create_channel(channel_name:string, group_name:string) {
    this.socketService.emit("create_channel", {
      channel_name: channel_name,
      group_name: group_name
    }, "admin");
  }
  
  delete_channel(channel_name:string, group_name:string) {
    this.socketService.emit("delete_channel", {
      channel_name: channel_name,
      group_name: group_name
    }, "admin");
  }
  
  add_user_to_channel(username:string, group_name:string, channel_name:string) {
    this.socketService.emit("add_user_to_channel", {
      username: username,
      group_name: group_name,
      channel_name: channel_name
    }, "admin");
  }
  
  remove_user_from_channel(username:string, group_name:string, channel_name:string) {
    this.socketService.emit("remove_user_from_channel", {
      username: username,
      group_name: group_name,
      channel_name: channel_name
    }, "admin");
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
  
  permissionlevels:Object = {};

  constructor(username:string, email:string) {
    this.username = username;
    this.email = email;
  }
}

