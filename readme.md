# Car Rental Reservation System Backend

## Project Overview

Welcome to the Car Rental Reservation System Backend repository! This project provides a robust backend solution for managing car rentals, bookings, and user authentication within a web application environment.

## Live Demo

Explore the live demo of the application [here](https://car-rental-reservation-system-backend-3.onrender.com).

## Features

- **User Management**: Register and authenticate users with roles (admin and user).
- **Car Management**: CRUD operations for managing car listings, including soft deletes.
- **Booking Management**: Enable users to book cars and admins to oversee and manage bookings.
- **Authentication & Authorization**: Secure endpoints with JWT-based authentication and role-based access control.
- **Error Handling**: Proper validation and error responses for API requests.
- **Transaction Support**: Ensure data integrity with transactional support (if applicable).

## Technology Stack

- **Programming Language**: TypeScript
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Documentation**: Swagger/OpenAPI (optional)

## Getting Started

To get started with the Car Rental Reservation System Backend, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/solayman-bd/car-rental-reservation-system-backend.git
   cd car-rental-reservation-system-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**
   Create a .env file in the root directory with the following variables:
   ```bash
   NODE_ENV=development
   PORT=3000 # Choose a port where you want to run the application
   DATABASE_URL=mongodb://localhost:27017/car_rental_system # Use your MongoDB URL
   BCRYPT_SALT_ROUNDS=10 # Set your bcrypt salt rounds
   JWT_ACCESS_SECRET=your_access_token_secret_key # Set your JWT access token secret key
   JWT_ACCESS_EXPIRES_IN=24h # Set your JWT access token expiration time
   ```
4. **Start the Development Server**

   ```bash
   npm run start:dev

   ```

5. **APIs examples:**
   check the postman_collection.json file attached in this repository
