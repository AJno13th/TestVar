# TestVar
U14465 Project
# Flashcard Application

# Author
Anthony Joshua

## Overview
This is a full-stack flashcard application that allows users to create, update, delete, and manage flashcards and decks. Users can also rate decks, track telemetry, and manage their accounts through authentication and authorization.

## Features
- User authentication (register, login, JWT-based authentication)
- Create, update, delete flashcards
- Create and manage decks
- Rate decks and view deck ratings
- Track user telemetry for study sessions
- Admin panel for managing users and setting limits
- Responsive frontend built with React
- Backend API built with Express and SQLite

## Technologies Used
- **Frontend**: React, Axios
- **Backend**: Node.js, Express, SQLite
- **Authentication**: JSON Web Token (JWT)
- **State Management**: React Hooks

## Installation

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

### Clone the Repository
```sh
git https://github.com/AJno13th/TestVar.git
cd TestVar
```

### Install Dependencies
```sh
npm install
```

## Running the Application

### Start the Backend Server
```sh
npm start
```

### Start the Frontend Application
```sh
cd client
npm start
```

## API Routes

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Flashcards
- `GET /api/flashcards` - Get all flashcards
- `POST /api/flashcards` - Add a new flashcard
- `PUT /api/flashcards/:id` - Update a flashcard
- `DELETE /api/flashcards/:id` - Delete a flashcard

### Decks
- `GET /api/decks` - Get all decks
- `POST /api/decks` - Create a new deck
- `POST /api/decks/:id/rate` - Rate a deck

### Admin
- `GET /api/admin/stats` - Get system statistics
- `PUT /api/admin/users/:id/role` - Update user role
- `POST /api/admin/limit` - Update daily deck limit

## Environment Variables
Create a `.env` file in the backend directory and configure:
```
PORT=3000
JWT_SECRET=36475722e63bf9e22cc132935707dbc31bd446d0866a20bbdc1a93a935f5cd3372714bd3d2d5b6f5d1f0917ab734411d2c8130c2c4d231b197f835a5d88ac884

```




