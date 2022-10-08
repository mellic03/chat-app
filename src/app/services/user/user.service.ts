import { HttpClient } from '@angular/common/http';
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

  constructor(private socketService:SocketService, private http:HttpClient) { }

  /**
   * @param username 
   * @param email 
   * @param password 
   * @param executor Username of user performing this action
   */
  create_user(username:string, email:string, password:string, executor:string) {
    this.socketService.emit("create_user", {
      username: username,
      email: email,
      password: password,
      executor: executor
    }, "admin");
  }
  
  delete_user(username:string, executor:string) {
    this.socketService.emit("delete_user", {
      username: username,
      executor: executor
    }, "admin");
  }

  update_profile_photo(username:string, image:any) {
    this.http.post<any>("http://159.196.6.181:3000/api/update_profile_photo", {
      username: username, image: image
    }).subscribe((img) => {
      // Update image in localStorage
      let user_info = JSON.parse(String(localStorage.getItem("user_info")));
      user_info.profile_photo = img;
      localStorage.setItem("user_info", JSON.stringify(user_info));
    });
  }

  /** Update a user's email address andpassword
   * @param email New email address
   * @param password New password
   * @param executor Username of user performing this action
   */
   update_user_credentials(email:string, password:string, executor:string) {
    this.socketService.emit("update_user_credentials", {
      email: email,
      password: password,
      executor: executor
    }, "admin");
  }

  set_role(username:string, role:number, group:string) {
    this.socketService.emit("set_role", {
      username: username,
      role: role,
      group: group
    }, "admin");
  }

  /**
   * @param group_name Name of the new group
   * @param executor Username of user performing this action
   */
  create_group(group_name:string, executor:string) {
    this.socketService.emit("create_group", {
      group_name: group_name,
      executor: executor
    }, "admin")
  }
  
  delete_group(group_name:string, executor:string) {
    this.socketService.emit("delete_group", {
      group_name: group_name,
      executor: executor
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

  update_peer_id(username:string, id:string) {
    this.socketService.emit("update_peer_id", {
      username: username,
      peer_id: id
    }, "admin");
  }

}

export class User {

  username:string;
  email:string;
  profile_photo:any;
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
  
  permission_levels:Object = {};

  constructor(username:string, email:string) {
    this.username = username;
    this.email = email;
  }
}

