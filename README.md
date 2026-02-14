# Real-Time Poll Rooms

A full-stack real-time polling application using Node.js, Express, Socket.IO, and React.

## Prerequisites

- Node.js installed
- MongoDB installed and running locally on port 27017

## Setup & Run

### 1. Backend

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
npm run dev
```

The server will start on http://localhost:5000.

### 2. Frontend

Open a new terminal and navigate to the `client` directory:

```bash
cd client
npm install
npm run dev
```

The frontend will start on http://localhost:5173 (or similar).

## Features

- Create Polls with multiple options.
- Shareable links for voting.
- Real-time vote updates using Socket.IO.
- Duplicate vote prevention (IP + UserAgent).
- LocalStorage checks for user experience.

## Technologies

- **Frontend**: React, Vite, Socket.IO Client, Axios via generic styling (CSS).
- **Backend**: Node.js, Express, Socket.IO, Mongoose.
- **Database**: MongoDB.
