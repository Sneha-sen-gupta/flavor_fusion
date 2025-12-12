# Database Schema - FlavorFusion

The application uses MongoDB with Mongoose ODM.

## User Model

| Field | Type | Required | Description | Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique identifier | Auto-generated |
| `username` | String | **Yes** | User's display name | - |
| `email` | String | **Yes** | User's email address | Unique |
| `password` | String | **Yes** | Hashed password | - |
| `avatarUrl` | String | No | URL to profile picture | Default: `''` |
| `bio` | String | No | User biography | Default: `''` |
| `savedRecipes` | [ObjectId] | No | List of saved recipes | Ref: `Recipe` |
| `createdAt` | Date | Yes | Creation timestamp | Auto-generated |
| `updatedAt` | Date | Yes | Last update timestamp | Auto-generated |

## Recipe Model

| Field | Type | Required | Description | Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique identifier | Auto-generated |
| `title` | String | **Yes** | Recipe title | - |
| `description` | String | No | Brief description | - |
| `author` | ObjectId | **Yes** | Creator of the recipe | Ref: `User` |
| `imageUrl` | String | No | Image of the dish | Default provided |
| `ingredients` | [String] | **Yes** | List of ingredients | - |
| `steps` | [String] | **Yes** | Cooking instructions | - |
| `category` | String | **Yes** | Meal type | Enum: `['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert', 'Other']` |
| `cookingTime` | String | No | Time to cook | - |
| `calories` | String | No | Caloric content | - |
| `mood` | String | No | Associated mood | - |
| `ratings` | [Object] | No | User ratings | `{ user: Ref(User), rating: Number }` |
| `comments` | [Object] | No | User comments | `{ user: Ref(User), text: String, createdAt: Date }` |
| `createdAt` | Date | Yes | Creation timestamp | Auto-generated |
| `updatedAt` | Date | Yes | Last update timestamp | Auto-generated |
