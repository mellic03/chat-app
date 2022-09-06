
# [Chat-App](https://github.com/mellic03/chat-app)



## **Git**

The Git repository for this project is composed of two branches: main and dev. All development is done on the ‘dev’ branch and when a new feature is implemented, dev is merged into main.


## **Data Structures**

**User**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>
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
   <td>A class with two properties: the sender of the message, and the content of the message
   </td>
  </tr>
  <tr>
   <td><strong>Members</strong>
   </td>
   <td>
<ul>

<li>sender: string

<li>content: string
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
   <td>
   </td>
  </tr>
  <tr>
   <td><strong>Members</strong>
   </td>
   <td>
<ul>

<li>name: string

<li>users: Array&lt;User>

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
   <td>
   </td>
  </tr>
  <tr>
   <td><strong>Members</strong>
   </td>
   <td>
<ul>

<li>name: string

<li>users: Array&lt;User>

<li>channels: Array&lt;Channel>
</li>
</ul>
   </td>
  </tr>
</table>



## **Angular Architecture**


### Components

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
   <td>
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
   <td>
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

<li>send_message()
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
   <td>
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
   <td>
   </td>
  </tr>
  <tr>
   <td><strong>Methods</strong>
   </td>
   <td>
<ul>

<li>set_username()
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
   <td>
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
   <td>
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



### Services

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



## **Node Server Architecture**


### Modules

**fakeDB.js**


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
   <td>
<ul>

<li>get_groups_of_user()

<li>get_users_of_group()

<li>get_channels_of_group()

<li>get_group()

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



### REST API

All API routes are GET requests except for /api/auth, which is POST. Any time data needs to be changed on the server, sockets are used for the request. After the request is completed, any data changed by the request is then emitted under an event named after the data. For example, if a client requests to delete a user, the server will delete the user and then emit an event called “users” which contains the new list of users.

**/api/auth**


<table>
  <tr>
   <td><strong>Description</strong>
   </td>
   <td>Return User object on successful validation of credentials.
   </td>
  </tr>
  <tr>
   <td><strong>Method</strong>
   </td>
   <td>POST
   </td>
  </tr>
  <tr>
   <td><strong>Return</strong>
   </td>
   <td>User
   </td>
  </tr>
</table>


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


**/api/groups/:group_name/users **


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

