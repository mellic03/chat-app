import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../services/user/user.service';
import { Channel, Group, GroupService, Message } from '../../services/group/group.service';
import { SocketService } from '../../services/socket/socket.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.scss']
})
export class ChatwindowComponent implements OnInit {

  current_user:User = new User("", "");
  message:any = ''; // Message from user

  current_group:Group = this.groupService.group;
  current_group_images:any = [];

  current_channel:Channel = this.groupService.channel;
  group_name:string = ""
  channel_name:string = ""

  image:any;
  image_name:string = "";
  image_selected:boolean = false;
  image_uploaded:boolean = false;

  images:any = [];

  constructor(private router:Router,
              private route:ActivatedRoute,
              private socketService:SocketService,
              private groupService:GroupService,
              private formBuilder:FormBuilder,
              private http:HttpClient,
              private userService:UserService)
  { }

  ngOnInit(): void {

    // Get info of logged-in user. If null, redirect to login page.
    if (typeof(localStorage) !== undefined) {
      let user_info = JSON.parse(String(localStorage.getItem("user_info")));
      if (user_info != null) {
        this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
      }
      else {
        this.router.navigateByUrl("/login");
      }
    }

    // Get group and channel name from route parameters
    this.route.params.subscribe((params:any) => {
      this.group_name = params.group_name;
      this.channel_name = params.channel_name;
      this.current_group = this.groupService.group;
      this.current_group_images = this.groupService.current_group_images;
      console.log(this.current_group_images);
    });


    this.groupService.current_channel.subscribe((channel:any) => {
      this.current_channel = channel;
      // load images from messages into images array
      // channel.messages.forEach((msg:Message) => {
      //   if (msg.type == "image")
      //     this.images.push(msg.content);
      // });
      // console.log(this.images);
    });

  }

  message_form = this.formBuilder.group({
    message_content: new FormControl('', [Validators.required])
  });
  send_message() {
   
    const message_content = this.message_form.value.message_content;
   
    if (message_content == "" || message_content == null || message_content == undefined)
      return;

    let msg = {
      message: new Message(this.current_user.username, "text", message_content),
      group_name: this.group_name,
      channel_name: this.channel_name
    }
    this.socketService.emit("message", msg);
    this.message_form.reset();
    
  }

  // Change the selected image to upload
  change_image(event:any) {

    this.image_name = event.target.files[0].name;
    this.image_selected = true;

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event:any) => {
        this.image = event.target.result;
        console.log("Image changed");
      }
    }

    event.target.value = "";
  }

  // Upload the selected image to the server
  upload_image() {
  
    if (this.image_selected) {
      const msg = {
        message: new Message(this.current_user.username, "image", this.image),
        group_name: this.group_name,
        channel_name: this.channel_name
      };

      let channel_path = this.group_name + "/" + this.channel_name;
      let no_whitespace = channel_path.replace(/\s/g, '-');
      
      this.http.post(`mongoserver:3000/api/groups/${no_whitespace}/add_image`, msg).subscribe((response:any) => {
        console.log(response);
      });
    }

    this.send_message();

    this.image_selected = false;
  }

}
