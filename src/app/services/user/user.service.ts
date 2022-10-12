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

  /** Create a new user
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
  
  /** Delete a user
   * @param username 
   * @param executor Username of user performing this action
   */
  delete_user(username:string, executor:string) {
    this.socketService.emit("delete_user", {
      username: username,
      executor: executor
    }, "admin");
  }

  /** Update a user's profile photo
   * @param username
   * @param image New profile photo
   */
  update_profile_photo(username:string, image:any) {
    this.http.post<any>("https://159.196.6.181:3000/api/update_profile_photo", {
      username: username,
      image: image
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

  /** Update a user's role
   * @param username 
   * @param role 
   * @param group 
   * @param executor Username of user performing this action
   */
  set_role(username:string, role:number, group:string, executor:string) {
    this.socketService.emit("set_role", {
      username: username,
      role: role,
      group: group,
      executor: executor
    }, "admin");
  }

  /** Create a new group
   * @param group_name Name of the new group
   * @param executor Username of user performing this action
   */
  create_group(group_name:string, executor:string) {
    this.socketService.emit("create_group", {
      group_name: group_name,
      executor: executor
    }, "admin")
  }
  
  /** Delete a group
   * @param group_name 
   * @param executor 
   */
  delete_group(group_name:string, executor:string) {
    this.socketService.emit("delete_group", {
      group_name: group_name,
      executor: executor
    }, "admin");
  }
  
 /** Add a user to a group
  * @param user_id 
  * @param group_id 
  */
  add_user_to_group(username:string, group_name:string, executor:string) {
    this.socketService.emit("add_user_to_group", {
      username: username,
      group_name: group_name,
      executor: executor
    }, "admin");
  }
  
  /** Remove a user from a group
   * @param username 
   * @param group_name 
   */
  remove_user_from_group(username:string, group_name:string, executor:string) {
    this.socketService.emit("remove_user_from_group", {
      username: username,
      group_name: group_name,
      executor: executor
    }, "admin");
  }

  /** Update a group photo
   * @param group_name 
   * @param photo 
   */
  update_group_photo(group_name:string, photo:any) {
    this.http.post<any>(`https://159.196.6.181:3000/api/groups/${group_name}/update_photo/`, {
      photo: photo
    }).subscribe((response) => {
      return response;
    });
  }

  /** Createa new channel
   * @param channel_name 
   * @param group_name 
   */
  create_channel(channel_name:string, group_name:string) {
    this.socketService.emit("create_channel", {
      channel_name: channel_name,
      group_name: group_name
    }, "admin");
  }
  
  /** Delete a channel
   * @param channel_name 
   * @param group_name 
   */
  delete_channel(channel_name:string, group_name:string) {
    this.socketService.emit("delete_channel", {
      channel_name: channel_name,
      group_name: group_name
    }, "admin");
  }
  
  /** Add a user to an already existing channel
   * @param username 
   * @param group_name 
   * @param channel_name 
   * @param executor Username of user performing this action
   */
  add_user_to_channel(username:string, group_name:string, channel_name:string, executor:string) {
    this.socketService.emit("add_user_to_channel", {
      username: username,
      group_name: group_name,
      channel_name: channel_name,
      executor: executor
    }, "admin");
  }
  
 /** Remove a user from a channel
  * @param username 
  * @param group_name 
  * @param channel_name 
   * @param executor Username of user performing this action
  */
  remove_user_from_channel(username:string, group_name:string, channel_name:string, executor:string) {
    this.socketService.emit("remove_user_from_channel", {
      username: username,
      group_name: group_name,
      channel_name: channel_name,
      executor: executor
    }, "admin");
  }

  /** Update the peer id of a user
   * @param username
   * @param id new peer id
   */
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

