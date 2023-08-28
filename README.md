# **[Chat-App](https://github.com/mellic03/chat-app)**

## 2808ICT Secure Development Operations

#### Setup
- Navigate to the root directory of the project: \
    `cd chat-app`

- Ensure nodejs and npm are installed: \
    `sudo apt install nodejs npm`

- Ensure the angular cli is installed: \
    `npm install -g @angular/cli`

- Install project dependencies: \
    `npm install`

- Build the Angular project and copy the output folder `dist` to `server/frontend/dist`: \
    `ng build` \
    `cp -R dist server/frontend/.`


#### Back-end Docker Image
- Navigate to the back-end server, install dependencies and create the docker image: \
    `cd server/backend` \
    `npm install` \
    `docker build -t mongo-server .` \
    `cd ../../`

#### Front-end Docker Image
- Navigate to the front-end server, install dependencies and create the docker image: \
    `cd server/frontend` \
    `npm install` \
    `docker build -t ng-server .` \
    `cd ../../`



### Running the Docker Containers

- Download mongo from DockerHub \
    `docker pull mongo`

- Download the back-end and front-end images from DockerHub \
    `docker pull mellic03/mongo-server` \
    `docker pull mellic03/ng-server`



#### Everything below is not relevant to 2808ICT


# CONTENTS

1. [Data Structures](#Data-Structures)
2. [Angular Architecture](#Angular-Architecture)
    - [Components](#Components)
    - [Services](#Services)
3. [Node Server Architecture](#Node-Server-Architecture)
    - [Modules](#Modules)
    - [REST API](#REST-API)


<a name=Data-Structures></a>

# **Data Structures**

**User**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Permissions are handled through two properties: role and permissionlevel.
<p>
The role property is used to decide whether or not to show the app-wide admin panel and can have a value of either 0, 1, or 2 representing the user, group admin and super admin roles.
<p>
The permissionlevel object contains a property named after each group the user is a member of. It is used to decide whether or not to show group-specific admin panels and what options are available in them. The value of each of these properties can be either 0, 1 or 2 representing the user, group assistant and group admin roles.
   </td>
  </tr>
  <tr>
   <td><strong>Members</strong>
   </td>
   <td>
<ul>

<li>username: string

<li>email: string

<li>role: number

<li>profile_photo: any

<li>permissionlevels:Object
</li>
</ul>
   </td>
  </tr>
</table>


**Message**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>A class which defines how messages are structured.
   </td>
  </tr>
  <tr>
   <td><strong>Members</strong>
   </td>
   <td>
<ul>

<li>sender: string

<li>content: any
</li>
</ul>
   </td>
  </tr>
</table>


**Channel**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>A class which holds an array of messages and an array of usernames. Group objects can have multiple of these to separate messages into channels.
   </td>
  </tr>
  <tr>
   <td><strong>Members</strong>
   </td>
   <td>
<ul>

<li>name: string

<li>users: Array&lt;string>

<li>messages: Array&lt;Message>
</li>
</ul>
   </td>
  </tr>
</table>


**Group**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Groups have a name, an array of usernames and an array of Channel objects. If a user is made group admin for any group their role will be set to 2, which provides access to the admin panel.
   </td>
  </tr>
  <tr>
   <td><strong>Members</strong>
   </td>
   <td>
<ul>

<li>name: string
<li>photo: any
<li>users: Array&lt;string>

<li>channels: Array&lt;Channel>
</li>
</ul>
   </td>
  </tr>
</table>


<a name=Angular-Architecture></a>

# **Angular Architecture**

<a name=Components></a>

## Components

**LoginComponent**


<table>
  <tr>
   <td><strong>Route</strong>
   </td>
   <td>/login
   </td>
  </tr>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>The login page for the application. Sends a POST request to the server to authenticate login credentials.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>login()
</li>
</ul>
   </td>
  </tr>
</table>


**ChatComponent**


<table>
  <tr>
   <td><strong>Route</strong>
   </td>
   <td>/chat
   </td>
  </tr>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Provides a sidebar to select a group and channel. Includes a router-outlet element to display either ChatWindow or GroupSettings
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>open_group()

<li>open_channel()
</li>
</ul>
   </td>
  </tr>
</table>


**ChatwindowComponent**


<table>
  <tr>
   <td><strong>Route</strong>
   </td>
   <td>/chat/chatwindow
   </td>
  </tr>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>The page where the actual chat functionality exists. Displayed through a router outlet in ChatComponent.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>send_message()
</li>
</ul>
   </td>
  </tr>
</table>


**GroupsettingsComponent**


<table>
  <tr>
   <td><strong>Route</strong>
   </td>
   <td>/chat/groupsettings
   </td>
  </tr>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>A page where users with elevated permissions can edit the properties of a group. Displayed through a router outlet in ChatComponent.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>add_user_to_channel()

<li>remove_user_from_channel()

<li>remove_user_from_group()

<li>create_channel()

<li>delete_channel()
</li>
</ul>
   </td>
  </tr>
</table>


**SettingsComponent**


<table>
  <tr>
   <td><strong>Route</strong>
   </td>
   <td>/settings
   </td>
  </tr>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Provides a frame/side bar for settings-related components to be accessed through
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
   </td>
  </tr>
</table>


**AccountComponent**


<table>
  <tr>
   <td><strong>Route</strong>
   </td>
   <td>/settings/account
   </td>
  </tr>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>A page where the user can update account information. Displayed through a router-outlet in SettingsComponent.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>set_username()

<li>set_email()

<li>set_password()
</li>
</ul>
   </td>
  </tr>
</table>


**PreferencesComponent**


<table>
  <tr>
   <td><strong>Route</strong>
   </td>
   <td>/settings/preferences
   </td>
  </tr>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>A page where the user can change app preferences. Displayed through a router-outlet in SettingsComponent.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>set_theme()

<li>set_video_quality()
</li>
</ul>
   </td>
  </tr>
</table>


<a name=Services></a>

## Services

**SocketService**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>SocketService provides socket functionality to other components of the application.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>listen()

<li>join_channel()

<li>emit()
</li>
</ul>
   </td>
  </tr>
</table>


**GroupService**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>GroupService provides a Subject object for both the current group and the current channel the user has open, along with methods to update those Subjects. It also contains the definitions of the Message, Channel and Group classes.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>set_current_group()

<li>set_current_channel()
</li>
</ul>
   </td>
  </tr>
</table>


**UserService**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Userservice handles user requests to the server, as well as providing the definition for the User class. All methods defined in UserService simply call SocketService to emit an event of the same name, passing the data passed as a parameter to the method as the data to be passed through sockets.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>create_user()

<li>delete_user()

<li>set_role()

<li>create_group()

<li>delete_group()

<li>add_user_to_group()

<li>remove_user_from_group()

<li>create_channel()

<li>delete_channel()

<li>add_user_to_channel()

<li>remove_user_from_channel()
</li>
</ul>
   </td>
  </tr>
</table>


**ThemeService**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>ThemeService provides a Subject object for components (namely AppComponent and PreferencesComponent) to access and update the current theme
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>set_theme()
</li>
</ul>
   </td>
  </tr>
</table>


<a name=Node-Server-Architecture></a>

# **Node Server Architecture**

<a name=Modules></a>

## Modules

**mongodb.js**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>A file containing functions for interacting with the mongodb database.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>verify_user()

<li>create_user()

<li>delete_user()

<li>get_user()

<li>update_user_credentials()

<li>update_profile_photo()

<li>add_message_to_channel()

<li>get_groups_of_user()

<li>get_channels_of_user()

<li>create_group()

<li>delete_group()

<li>get_group()

<li>get_group_names()

<li>update_group_photo()

<li>get_channels()

<li>create_channel()

<li>delete_channel()

<li>get_channels_of_group()

<li>add_user_to_group()

<li>remove_user_from_group()

<li>add_user_to_channel()

<li>remove_user_from_channel()

<li>set_role()

<li>update_peer_id()
</li>
</ul>
   </td>
  </tr>
</table>


**routes.js**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Routes are split into two files: user_routes.js and group_routes.js which contain routes related to user data and group data respectively.
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>A route description for each API endpoint described in the REST API section of this document.
   </td>
  </tr>
</table>


**sockets.js**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Sockets.js has two purposes:
<ol>

<li>Execute functions defined in fakeDB.js upon receiving a request through sockets.

<li>Emit data sent through a channel to all clients connected to that channel.
</li>
</ol>
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>Various calls to functions defined in fakeDB.js
   </td>
  </tr>
</table>


<a name=REST-API></a>

## REST API

All API endpoints are GET except for four which are POST (listed below). Generally, any time data needs to be changed on the server, sockets are used for the request. After the request is completed, any data changed by the request is then emitted under an event named after the data. For example, if a client requests to delete a user, the server will delete the user and then emit an event called “users” which contains the new list of users.

The following API endpoints are POST:

**/api/auth**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return User object on successful validation of credentials. If the server fails to validate the credentials, a user object with all properties set to false is returned.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>User
   </td>
  </tr>
</table>


**/api/groups/:group_name/update_photo**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Update the group photo
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>True or false on success or failure
   </td>
  </tr>
</table>


**/api/update_profile_photo**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Update the profile photo of a user
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>True or false on success or failure
   </td>
  </tr>
</table>


**/api/groups/:group_name/:channel_name/add_image**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Send an image message to a channel
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>True or false on success or failure
   </td>
  </tr>
</table>


The following API endpoints are GET:

**/api/groups/names**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return an array of all group names.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Array&lt;string>
   </td>
  </tr>
</table>


**/api/groups/:group_name**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return the group with name “group_name”
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Group
   </td>
  </tr>
</table>


**/api/groups/:group_name/users**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return an array of users who are a member of “group_name”.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Array&lt;User>
   </td>
  </tr>
</table>


**/api/groups/:group_name/channels**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return an array of channels in “group_name”.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Array&lt;Channel>
   </td>
  </tr>
</table>


**/api/groups/:group_name/channels/:channel_name**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return the channel “channel_name” from the group “group_name”.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Channel
   </td>
  </tr>
</table>


**/api/users**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return an array of all users.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Array&lt;User>
   </td>
  </tr>
</table>


**/api/users/usernames**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return an array of all usernames.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Array&lt;string>
   </td>
  </tr>
</table>


**/api/users/:username/groups**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return an array of group names which “username” is a member of.
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>Array&lt;Group>
   </td>
  </tr>
</table>

