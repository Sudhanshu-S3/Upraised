# IMF Gadget Inventory API


The IMF Gadget Inventory API provides a secure interface for managing, tracking, and controlling special gadgets for field operations. This application includes authentication, authorization, and detailed inventory management functionality.

## Getting Started

### Prerequisites
Before you begin, make sure you have:
- Node.js (v14 or higher)
- A PostgreSQL database up and running

### Installation

1. **Clone the repository** to your local machine.
2. **Install the dependencies** by running:
   ```bash
   npm install
   ```
3. **Set up your environment variables:** Create a `.env` file in the root directory and add the following:
   ```bash
   RENDER_DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=7070
   ```
4. **Start the server** with:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### Register a New User
Create a new user by sending a `POST` request to:
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "username": "agent007",
  "email": "james.bond@imf.com",
  "password": "secretpassword"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "agent007",
    "email": "james.bond@imf.com",
    "role": "user"
  }
}
```

#### Login
To log in, send a `POST` request to:
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "james.bond@imf.com",
  "password": "secretpassword"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get User Profile
Fetch your profile details by sending a `GET` request to:
```
GET /api/auth/profile
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "agent007",
    "email": "james.bond@imf.com",
    "role": "user"
  }
}
```

#### Get All Users (Admin Only)
Admins can retrieve all users with a `GET` request to:
```
GET /api/auth/admin/users
```
**Headers:**
```
Authorization: Bearer your_admin_jwt_token
```
**Response:**
```json
{
  "success": true,
  "message": "Admin access granted"
}
```

### Gadget Endpoints

#### Get All Gadgets
Retrieve all gadgets with a `GET` request:
```
GET /api/gadgets
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Optional Query Parameter:**
- `status`: Filter gadgets by status (Available, Deployed, Destroyed, Decommissioned)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Explosive Pen",
      "description": "Pen that detonates after three clicks",
      "price": 2500.00,
      "codename": "Operation Falcon",
      "status": "Available",
      "mission_success_probability": 85
    }
  ]
}
```

#### Add a New Gadget (Admin Only)
To add a new gadget, send a `POST` request:
```
POST /api/gadgets
```
**Headers:**
```
Authorization: Bearer your_admin_jwt_token
```
**Request Body:**
```json
{
  "name": "Invisible Car",
  "description": "Car with optical camouflage technology",
  "price": 750000.00
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Invisible Car",
    "description": "Car with optical camouflage technology",
    "price": 750000.00,
    "codename": "The Phantom",
    "status": "Available"
  }
}
```

#### Update a Gadget (Admin Only)
To update gadget details, send a `PATCH` request:
```
PATCH /api/gadgets/:id
```
**Headers:**
```
Authorization: Bearer your_admin_jwt_token
```
**Request Body:**
```json
{
  "name": "Advanced Invisible Car",
  "price": 850000.00
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Advanced Invisible Car",
    "description": "Car with optical camouflage technology",
    "price": 850000.00,
    "codename": "The Phantom",
    "status": "Available"
  }
}
```

#### Delete a Gadget (Admin Only)
To remove a gadget, send a `DELETE` request:
```
DELETE /api/gadgets/:id
```
**Headers:**
```
Authorization: Bearer your_admin_jwt_token
```
**Response:**
```
204 No Content
```

#### Generate a Self-Destruct Code
Generate a self-destruct code for a gadget with a `GET` request:
```
GET /api/gadgets/:id/self-destruct
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
{
  "success": true,
  "message": "Self-destruct timer set"
}
```

#### Self-Destruct a Gadget
To trigger the self-destruct sequence, send a `POST` request:
```
POST /api/gadgets/:id/self-destruct
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Request Body:**
```json
{
  "code": "a1b2c3d4"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Gadget self-destructed successfully"
}
```

## Authorization

Our API uses JWT tokens to control access. Here's a quick rundown:
- **Public Endpoints:** No token required.
- **User Endpoints:** Need a valid JWT token.
- **Admin Endpoints:** Require a valid JWT token with admin privileges.

Whenever you make a request to a secured endpoint, just include your token in the header like this:
```
Authorization: Bearer your_jwt_token
```

## Error Handling

If something goes wrong, the API will respond with an appropriate HTTP status code and a helpful JSON message, for example:
```json
{
  "success": false,
  "message": "Error message details"
}
```

## Database Schema

### Users Table
- **id:** SERIAL PRIMARY KEY
- **username:** VARCHAR(255) NOT NULL
- **email:** VARCHAR(255) NOT NULL UNIQUE
- **password:** VARCHAR(255) NOT NULL
- **role:** VARCHAR(50) DEFAULT 'user'

### Gadgets Table
- **id:** UUID PRIMARY KEY
- **name:** VARCHAR(255) NOT NULL
- **description:** TEXT
- **price:** NUMERIC(10,2)
- **codename:** VARCHAR(255) NOT NULL
- **status:** VARCHAR(20) DEFAULT 'Available'
- **decommissioned_at:** TIMESTAMP
- **self_destruct_time:** BIGINT

## License

This project is licensed under the ISC License.

## Author

Sudhanshu Shukla
