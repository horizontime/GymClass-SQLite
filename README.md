# GymClass-SQLite

Web app to sign up for gym classes.

## Technologies Used

-   **Frontend**: React, TailwindCSS, MaterialUI
-   **Backend**: Node.js, Express
-   **Database**: SQLite

## Features

-   User authentication
-   CRUD operations
-   Responsive design

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
