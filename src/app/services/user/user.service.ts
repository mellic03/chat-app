import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  roles:Array<string> = ["user", "group assistant", "group admin", "super admin"];

  constructor() { }
  
  create_user(username:string, email:string) {
    console.log("test");
  }
  
  delete_user(user_id:number, email:string) {
    console.log("test");
  }
  
  promote_to_assistant(user_id:number) {
    
  }
  
  promote_to_admin(user_id:number) {
  
  }
  
  promote_to_super_admin(user_id:number) {
  
  }
  
  create_group() {
  
  }
  
  delete_group() {
  
  }
  
  add_user_to_group() {
  
  }
  
  remove_user_from_group() {
    
  }
  
  create_channel() {
  
  }
  
  delete_channel() {
  
  }
  
  add_user_to_channel() {
  
  }
  
  remove_user_from_channel() {
    
  }
}

export class User {

  email:string;
  username:string;
  role:string = "user";
  id:number;

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
