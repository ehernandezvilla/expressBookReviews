# Project Documentation

## Overview

This project is a Node.js application using Express for creating a simple web server. It includes functionality for user registration, login, and a framework for accessing book information. The application demonstrates the use of Express routes, middlewares, and session management.

## Setup

### Dependencies

- Node.js
- Express
- express-session
- jsonwebtoken

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the required dependencies.

### Running the Application

Execute `node index.js` from the terminal to start the server. The server will be running on `http://localhost:5000`.

## Application Structure

### index.js

The entry point for the application. It sets up the Express server, session middleware, and mounts route handlers.

- **Session Middleware**: Configures session management for authenticated routes.
- **Routes**: Two main route groups are configured:
  - `/customer` for authenticated customer routes.
  - `/` for general public routes.

### auth_users.js

Defines routes and functionalities related to user authentication.

- **/login**: Handles user login requests.
- **Authenticated Routes**: Includes a placeholder for adding a book review, accessible only by authenticated users.

### general.js

Handles general public routes.

- **/register**: Allows new users to register.
- **Book Information Routes**: Placeholder routes for book-related functionalities, like fetching books by various criteria (ISBN, author, title, review).

### Middleware for Authentication

A middleware function `auth` is used to protect certain routes, ensuring they are accessible only by authenticated users.

## Key Functionalities

### User Registration and Login

- Users can register by sending a POST request to `/register` with a `username` and `password`.
- Registered users can log in by sending a POST request to `/customer/login`.

### Book Information Access

- The application outlines a structure for accessing book information through various endpoints (e.g., `/isbn/:isbn`, `/author/:author`). These are intended to be implemented with specific logic to fetch book data.

## Security Notes

- User passwords are pushed directly into an array without encryption. In a real application, passwords should be securely hashed before storage.
- The JWT secret and session secret are hardcoded in the source files. For production environments, these should be stored securely and accessed via environment variables or a secure vault.

## Future Enhancements

- Implement the book information routes with actual data fetching from a database or API.
- Add password hashing for user registration and authentication.
- Improve session and JWT handling for better security.

