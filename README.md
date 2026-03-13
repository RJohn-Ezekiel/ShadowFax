# ShadowFax Terminal Chat

ShadowFax is a **terminal-style realtime chat application** built with **HTML, CSS, JavaScript, and Firebase Realtime Database**.
It simulates a **hacker-style terminal chat environment** with a Matrix background, command-based interactions, and live user presence.

---

## Preview

ShadowFax provides a **green-on-black terminal interface** where users can join chat rooms, send messages, and interact using commands.

Features include:

* Terminal-style UI
* Matrix digital rain background
* Live realtime messaging
* Online user list
* Typing indicators
* Admin command system
* Theme switching

---

## Features

### Terminal Chat Interface

* Hacker-style **green-on-black terminal UI**
* Multiline message support
* Timestamped messages
* Auto-scrolling chat terminal

### Realtime Communication

* Powered by **Firebase Realtime Database**
* Messages update instantly for all users
* Live typing indicator

### Online User Tracking

* Sidebar showing **currently online users**
* Heartbeat presence system prevents ghost users

### Admin Commands

Admins can control the chat using commands:

```
/clear
```

Clears the entire chat for all users

```
/kick username
```

Removes a user from the room

```
/broadcast message
```

Sends an admin announcement

### User Commands

```
/users
```

Displays currently online users

```
/neofetch
```

Displays system information about the session

### Visual Effects

* Matrix-style animated background
* Terminal-style text rendering
* Theme selector (Green / Blue / White)

---

## Project Structure

```
shadowfax/
│
├── index.html
├── signup.html
├── dashboard.html
├── room.html
│
├── css/
│   └── style.css
│
└── js/
    ├── auth.js
    ├── dashboard.js
    ├── firebase.js
    ├── login.js
    ├── matrix.js
    └── room.js
```

---

## Technologies Used

* **HTML5**
* **CSS3**
* **JavaScript (ES Modules)**
* **Firebase Realtime Database**
* Canvas API (Matrix animation)

---

## How to Run

### 1. Clone the repository

```
git clone https://github.com/yourusername/shadowfax.git
```

### 2. Open the project folder

```
cd shadowfax
```

### 3. Configure Firebase

Edit:

```
js/firebase.js
```

Replace the Firebase configuration with your own:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID"
};
```

### 4. Run the project

Simply open:

```
index.html
```

in your browser.

---

## Example Chat

```
[22:30:01] system: Admin joined
[22:30:04] system: John3 joined
[22:30:10] John3: hello
[22:30:15] Admin: welcome
[22:30:40] system: John3 left
```

---

## Future Improvements

Possible upgrades for the project:

* Private messaging (`/whisper`)
* File and image sharing
* Multiple chat rooms
* Message editing/deleting
* User authentication
* Message history limits
* Mobile responsive UI

---

## Author - John Ezekiel

Created as a **terminal-style realtime chat project**. <br>
Its users' username and password is (any alphanumeric string - like gandalf3, Friend123) <br>

---
