# API Documentation - FlavorFusion

Base URL: `/api`

## Authentication (`/auth`)

| Method | Endpoint | Description | Protected | Content-Type | Body Parameters |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new user | No | `application/json` | `username`, `email`, `password` |
| **POST** | `/login` | Login user & get token | No | `application/json` | `email`, `password` |
| **GET** | `/me` | Get current user info | **Yes** | - | - |
| **PUT** | `/save/:id` | Toggle save/unsave recipe | **Yes** | - | - |
| **PUT** | `/profile` | Update user profile | **Yes** | `application/json` | `username`, `email`, `bio`, `avatarUrl`, `password` (optional) |
| **GET** | `/:id` | Get public user profile | No | - | - |

## Recipes (`/recipes`)

| Method | Endpoint | Description | Protected | Content-Type | Body Parameters |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Get all recipes | No | - | Query params (optional): `keyword`, `page` |
| **POST** | `/` | Create a new recipe | **Yes** | `application/json` | `title`, `ingredients`, `steps`, `category`, `description`, `imageUrl`, `cookingTime`, `calories`, `mood` |
| **GET** | `/top-contributors` | Get top contributing users | No | - | - |
| **GET** | `/:id` | Get single recipe by ID | No | - | - |
| **PUT** | `/:id` | Update a recipe | **Yes** | `application/json` | Same as creation |
| **DELETE** | `/:id` | Delete a recipe | **Yes** | - | - |
| **POST** | `/:id/comments` | Add a comment | **Yes** | `application/json` | `text` |
| **POST** | `/:id/rating` | Rate a recipe | **Yes** | `application/json` | `rating` (Number) |

## AI Suggestions (`/ai`)

| Method | Endpoint | Description | Protected | Content-Type | Body Parameters |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/suggest` | Get AI recipe suggestions | **Yes** | `application/json` | `ingredients` (Array), `preferences` (String/Object) |

## Authentication Header
Protected routes require a Bearer Token in the Authorization header:
```
Authorization: Bearer <your_token>
```
