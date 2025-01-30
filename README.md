# GymClass-SQLite

A web app for managing gym class reservations, allowing users to view schedules, reserve classes, track attendance, and manage memberships.

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Material-UI, Vite
- **Backend**: Node.js, Express.js, SQLite3
- **Authentication**: JWT, bcrypt
- **Database**: SQLite with automatic schema initialization and sample data seeding
- **Scheduling**: Node-Cron for monthly membership updates.

## Features

- **User Authentication**: Sign up, log in, and logout functionality with JWT tokens.
- **Class Reservation**: 
  - View weekly class schedules with coach and time details.
  - Reserve or cancel classes.
  - Real-time updates on remaining membership days.
- **Attendance Tracking**: 
  - View upcoming classes and attendance history in paginated tables.
- **Profile Management**: 
  - Edit user profile (name, email, password).
  - Upgrade/downgrade membership plans (changes apply in the next billing cycle).
- **Responsive UI**: Built with Tailwind CSS and Material-UI for consistent styling across devices.
- **Automatic Membership Reset**: Monthly cron job to reset class allowances based on membership type.

## Installation

1. Open a terminal. Navigate to the `server` directory, and install dependencies:

    ```bash
    cd server
    npm install
    ```

2. Create a `.env` file in the `server` directory. Add your server PORT number and JWT secret:

    ```plaintext
     # NODE APP ENVIRONMENT VARIABLES
     PORT=3000
     JWT_SECRET_KEY=mostSecretOfSecretKeys
    ```

3. Run the server:

    ```bash
    npm start
    ```

4. Open another terminal. Navigate to the `client` directory, install dependencies, and start the client:
    ```bash
    cd client
    npm install
    npm start
    ```

## Usage

1. Navigate to http://localhost:5173 in your web browser.

2. An example user has been created for you. 
    - Email: john@email.com
    - Password: john

3. Log-in and play around with the app. You can add/remove gym classes, view attendence, and edit your profile.
