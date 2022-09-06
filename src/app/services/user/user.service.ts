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

  current_user_role = new Subject<number>();

  constructor(private socketService:SocketService) { }

  update_current_role(role:number) {
    this.current_user_role.next(role);
  }

  create_user(username:string, email:string, password:string) {
    this.socketService.emit("create_user", {
      username: username,
      email: email,
      password: password
    });
  }
  
  delete_user(user_id:number) {
    this.socketService.emit("delete_user", {
      user_id: user_id
    });
  }
  
  set_role(user_id:number, role:number) {
    this.socketService.emit("set_role", {
      user_id: user_id,
      role: role
    });
  }

  create_group(group_name:string) {
    this.socketService.emit("create_group", {
      group_name: group_name
    })
  }
  
  delete_group(group_id:number) {
    this.socketService.emit("delete_group", {
      group_id: group_id
    });
  }
  
  add_user_to_group(user_id:number, group_id:number) {
    this.socketService.emit("add_user_to_group", {
      user_id: user_id,
      group_id: group_id
    });
  }
  
  remove_user_from_group(user_id:number, group_id:number) {
    this.socketService.emit("remove_user_from_group", {
      user_id: user_id,
      group_id: group_id
    });
  }
  
  create_channel(channel_name:string, group_id:number) {
    this.socketService.emit("create_channel", {
      channel_name: channel_name,
      group_id: group_id
    });
  }
  
  delete_channel(channel_name:string) {
    this.socketService.emit("delete_channel", {
      channel_name: channel_name
    });
  }
  
  add_user_to_channel(user_id:number, channel_id:number) {
    this.socketService.emit("add_user_to_channel", {
      user_id: user_id,
      channel_id: channel_id
    });
  }
  
  remove_user_from_channel(user_id:number, channel_id:number) {
    this.socketService.emit("remove_user_from_channel", {
      user_id: user_id,
      channel_id: channel_id
    });
  }
}


export class User {

  id:number;
  username:string;
  email:string;
  password:string = "";
  role:number = USER;

  // A new user has no system permissions.
  permissions:Object = {
    CREATE_USER: false,
    DELETE_USER: false,
    
    PROMOTE_TO_ASSISTANT: false,
    PROMOTE_TO_ADMIN: false,
    PROMOTE_TO_SUPER_ADMIN: false,
    
    CREATE_GROUP: false,
    DELETE_GROUP: false,
    ADD_USER_TO_GROUP: false,
    REMOVE_USER_FROM_GROUP: false,

    CREATE_CHANNEL: false,
    DELETE_CHANNEL: false,
    ADD_USER_TO_CHANNEL: false,
    REMOVE_USER_FROM_CHANNEL: false
  };
  
  constructor(username:string, email:string) {
    this.username = username;
    this.email = email;
    this.id = 0;
  }
}

