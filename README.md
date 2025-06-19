# Collaborative Code Editor - Fullstack App

This is a **collaborative code editor** built with real-time support, real-time chat ,multiple language execution, user authentication, and socket-based communication for live code sharing and interactions.

---


## 🛠️ Tech Stack

* **Frontend**: React + TailwindCSS + Zustand + TanStack Query + shadcn/ui
* **Backend**: Node.js + Express + JWT + MongoDB + Redis
* **Sockets**: Socket.IO (chat & room collaboration)
* **Execution Engine**:

  * Languages supported: C++, Java, Python
  * Runs inside Docker
  * Async execution with polling
* **Other Tools**: Redis (for job queues and result storage), BullMQ (for job processing)

---

## 📑 Features

### ✅ General

* User Auth ((JWT+Session)-based) implemented token rotation and validated them against the browser fingerprint and hashed redis entries for more security . log out from all devices supported via otp based verification 
* Survey system with role-based users (Admin, Business, User)

### 🖋️ Collaborative Editor

* Real-time code sync across clients
* Supports multiple languages (C++, Python, Java)
* Output & Input area below editor
* Run button executes via microservice
* Invite friends to a room
* Will support cursor sharing

### 🔌 Socket Features

* Chat server on `:5000`
* Room collaboration socket on `:5001`
* Cursor tracking (planned)

---

## ⚙️ Running Locally

### Prerequisites

* Docker
* Node.js
* Redis

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/collab-editor
cd collab-editor

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../code-executor && npm install

# Start redis manually or with Docker
redis-server

# Start backend
cd backend && npm run dev

# Start socket server
cd socketServer && node index.js

# Start frontend
cd frontend && npm run dev

# Start code execution service
cd code-executor && node index.js
```

---

## 🚀 Deployment

* Uses Docker containers for microservices
* Can be hosted on EC2
* CORS managed using wildcard + credentials
* Socket paths can be namespaced: `/socket/chat`, `/socket/room`
* Let's Encrypt can provide HTTPS certificates

---

## ✈ TODO

* [x] Input/Output sync via socket
* [x] Run button
* [x] Java support with Docker
* [x] Invite system UI revamp
* [ ] Cursor tracking between users
* [ ] Better user session sync on reload

---

## 📅 Timeline

* Started: June 2025
* Built in \~3 weeks
* Part of internship resume project series

---

## ✨ Author

* Mokshu (IIT ISM Dhanbad CSE)

---

## ⚡ Example POST (Code Execution)

```json
{
  "roomId": "abc123",
  "language": "cpp",
  "code": "#include<iostream>\nint main(){std::cout<<\"Hello\";return 0;}",
  "input": ""
}
```

---

> For full documentation on socket usage, invite flow, and more, please refer to `docs/` (WIP).

---
