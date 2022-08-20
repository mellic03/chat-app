import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }



  valid_users = [
    new User("mellic03", "Michael", "08/04/1999", 23, "michael@mail.com", "mpass", true),
    new User("sophiejw", "Sophie", "13/01/2000", 22, "sophie@mail.com", "spass", true),
    new User("werhmacht pepe", "Aiden", "26/02/1999", 23, "aiden@mail.com", "apass", true),
  ];


}

export class User {
  username:string;
  name:string;
  birthdate:string;
  age:number;
  email:string;
  password:string;
  valid:boolean;

  constructor(
    username:string = "",
    name:string = "",
    birthdate:string = "",
    age:number = 0,
    email:string = "",
    password:string = "",
    valid:boolean = false
  ) {
    this.username = username;
    this.name = name;
    this.birthdate = birthdate;
    this.age = age;
    this.email = email;
    this.password = password;
    this.valid = valid;
  }
}

