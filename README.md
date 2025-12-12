# FlavorFusion

FlavorFusion is a Full-Stack MERN application that allows users to discover, share, and manage recipes. It features AI-powered recipe suggestions to enhance the cooking experience.

## Features

*   **User Authentication**: Secure registration and login (JWT).
*   **Recipe Management**: Create, read, update, and delete recipes.
*   **Social Features**: Rate recipes, comment, and save favorites.
*   **AI Integration**: Get smart recipe suggestions based on ingredients.
*   **Profile Management**: Update user profile and track contributions.

## Tech Stack

*   **Frontend**: React (Client folder)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (with Mongoose)
*   **AI**: Google Generative AI
*   **Authentication**: JSON Web Tokens (JWT), Bcrypt

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd flavorfusion
    ```

2.  **Install Dependencies**

    *   **Backend**:
        ```bash
        npm install
        ```
    *   **Frontend**:
        ```bash
        cd client
        npm install
        ```

3.  **Environment Variables**

    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    GEMINI_API_KEY=<your_google_gemini_api_key>
    ```

4.  **Run the Application**

    *   **Development Mode** (Backend):
        ```bash
        npm run dev
        ```
    *   **Frontend**:
        ```bash
        cd client
        npm start
        ```

## Documentation

*   [API Documentation](./API.md)
*   [Database Schema](./SCHEMA.md)
