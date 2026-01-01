# Week 6 Lab: Password Hashing, JWT Authentication & Role-Based Access Control

## 1.0 INTRODUCTION

#### This lab focuses on designing and implementing a RESTful Ride-Hailing API using Express.js and MongoDB. The system supports three roles: Customer, Driver, and Admin, each with different access privileges.

#### The API includes:
#### - CRUD operations
#### - JWT-based authentication
#### - Role-based authorization
#### - API testing using Postman

<br>

## 2.0 Task 1: Brainstorm Actors and Use Cases


#### Actors:
#### - Customers
#### - Driver
#### - Admin

<br>

### Use Cases:
#### 1. Customer:
#### - Register account
#### - Login
#### - View profile
#### - Book ride
#### - Track ride 
#### 2. Driver:
#### - Login
#### - Update availability status
#### - View earnings
#### 3. Admin
#### - Login
#### - View system analytics
#### - Block users
<br>

## 3.0 Task 2: Design the Use Case Diagram
### Use Case Diagram
![Postman POST Screenshot](../Screenshots/UseCaseDiagram.png)
<br>

## 4.0 Task 3: API Specifications
### Customer APIs
| Use Case         | Endpoint      | Method | Status Codes                 |
| ---------------- | ------------- | ------ | ---------------------------- |
| Register Account | `/users`      | POST   | 201 Created, 400 Bad Request |
| Login            | `/auth/login` | POST   | 200 OK, 401 Unauthorized     |
| View Profile     | `/users/{id}` | GET    | 200 OK, 404 Not Found        |
| Book Ride        | `/rides`      | POST   | 201 Created, 400 Bad Request |
| Track Ride       | `/rides/{id}` | GET    | 200 OK, 404 Not Found        |
<br>

### Driver APIs
| Use Case            | Endpoint                 | Method | Status Codes             |
| ------------------- | ------------------------ | ------ | ------------------------ |
| Login               | `/auth/login`            | POST   | 200 OK, 401 Unauthorized |
| Update Availability | `/drivers/{id}/status`   | PATCH  | 200 OK, 404 Not Found    |
| View Earnings       | `/drivers/{id}/earnings` | GET    | 200 OK, 404 Not Found    |
<br>

### Admin APIs
| Use Case       | Endpoint            | Method | Status Codes                  |
| -------------- | ------------------- | ------ | ----------------------------- |
| Login          | `/auth/login`       | POST   | 200 OK, 401 Unauthorized      |
| Block User     | `/admin/users/{id}` | DELETE | 204 No Content, 403 Forbidden |
| View Analytics | `/admin/analytics`  | GET    | 200 OK, 403 Forbidden         |
<br>

## 5.0 Task 4: Data Model Design 
### User Collection
```
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "Hashed String",
  "role": "customer | driver | admin",
  "status": "active | blocked"
}

```
<br>

### Ride Collection
```
{
  "_id": "ObjectId",
  "customerId": "ObjectId",
  "driverId": "ObjectId",
  "pickupLocation": "String",
  "dropoffLocation": "String",
  "status": "requested | ongoing | completed"
}

```
<br>

## 6.0 Task 5: Authentication & Authorization
### JWT Authentication
#### - Users authenticate using /auth/login
#### - A JWT token is returned upon successful login
#### - Token must be sent in request headers: 
```
Authorization: Bearer <JWT_TOKEN>
```
<br>

### Role-Based Authorization

#### - Customer: Access ride booking and profile endpoints
#### - Driver: Access availability update and earnings endpoints
#### - Admin: Access user management and analytics endpoints
<br>

### Middleware used:

#### - `authenticate`
#### - `authorize(['role'])`
<br>

## 7.0 Task 6: API Testing Using Postman
### 1. Customer Registration
![Postman POST Screenshot](../Screenshots/week6/REGISTER%20CUSTOMER.jpeg)
<br>

### 2. Customer Login (JWT Token Generated)
![Postman POST Screenshot](../Screenshots/week6/LOGINTOKEN.jpeg)
<br>

### 3. Book Ride
![Postman POST Screenshot](../Screenshots/week6/CREATERIDE.jpeg)
<br>

### 4. Track Ride
![Postman POST Screenshot](../Screenshots/week6/TRACK%20RIDE.jpeg)
<br>

### 5. Driver Update Availability
![Postman POST Screenshot](../Screenshots/week6/DRIVERUPDATESTATUS.jpeg)
<br>

### 6. Driver View Earnings
![Postman POST Screenshot](../Screenshots/week6/DRIVERVIEWEARNINGS.jpeg)
<br>

### 6. Driver View Earnings
![Postman POST Screenshot](../Screenshots/week6/DRIVERVIEWEARNINGS.jpeg)
<br>

### 7. Register Admin
![Postman POST Screenshot](../Screenshots/week6/REGISTERADMIN.jpeg)
<br>

### 8. Login Admin
![Postman POST Screenshot](../Screenshots/week6/LOGINADMIN.jpeg)
<br>

## 8.0 Task 8: Security Measures

#### - Passwords are hashed using bcrypt
#### - JWT tokens are signed using a secret key
#### - Protected endpoints require authentication
#### - Role-based access control prevents unauthorized actions

## 9.0 Lab Questions

### 1. Token Usage
### 1.1 What happens if the Authorization header is omitted when accessing /admin/users/{id}?

#### Test Performed:

#### `Endpoint: DELETE /admin/users/{id}`

#### Authorization header: ❌ Not included

#### Result:
```
{```
  "error": "Unauthorized"
}
```

#### Status Code: 401 Unauthorized

#### Explanation:
#### The request is rejected by the authenticate middleware because no JWT token is provided in the Authorization header.
<br>

### 1.2 What error occurs if an expired token is used?

#### Test Performed:

#### Used a JWT token that has passed its expiration time

#### `Endpoint: DELETE /admin/users/{id}`

#### Result:
```
{
  "error": "Invalid token"
}
```

#### Status Code: 401 Unauthorized

#### Explanation:
#### The JWT verification fails because the token’s exp (expiry) timestamp is no longer valid.
<br>

### 1.3 JWT Token Content Analysis (jwt.io)

#### The generated JWT token was pasted into `https://jwt.io`

#### Decoded Payload Example:
```
{
  "userId": "65abc1234f8c9a0012abcd34",
  "role": "admin",
  "iat": 1710000000,
  "exp": 1710003600
}
```

#### Discussion:
```
userId: Identifies the authenticated user

role: Used for role-based authorization

iat: Token issued time

exp: Token expiry time

This payload allows the server to authenticate the user and enforce access control.
```
<br>

### 2. Role Restrictions
### 2.1 Customer tries to access /admin/users/{id}

#### Test Performed:

#### Logged in as a customer

#### Used customer token to access:

#### `DELETE /admin/users/{id}`

#### Result:
```
{
  "error": "Forbidden"
}
```

#### Status Code: `403` Forbidden

#### Explanation:
#### The `authorize(['admin'])` middleware blocks access because the user role is `customer`.
<br>

### 2.2 Allow both Admin and Driver roles to access an endpoint

#### Current Middleware:

#### `authorize(['admin'])`


#### Modified Middleware:

#### `authorize(['admin', 'driver'])`


#### Explanation:
#### This change allows both admin and driver roles to access the protected endpoint.
<br>

### 3. Security
### 3.1 Why is the JWT token sent in the Authorization header instead of the request body?

#### Reasons:
```
- Follows HTTP authentication standards

- Prevents accidental logging of sensitive data

- Compatible with middleware-based authentication

- Allows easy protection of multiple endpoints
```
#### Best Practice Format:
```
Authorization: Bearer <JWT_TOKEN>
```
<br>

### 3.2 How does password hashing protect user data in a breach?

#### Explanation:
```
- Passwords are hashed using bcrypt

- Even if the database is compromised:

     - Plaintext passwords are not exposed

     - Hashes cannot be reversed

- Salting prevents rainbow table attacks
```
#### This significantly reduces the impact of data breaches.
<br>

### 4. Postman Testing
### 4.1 Purpose of the Bearer keyword in Authorization header

#### Example Header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Explanation:

#### Bearer indicates the token type

#### Tells the server to expect a JWT

#### Required by many authentication middleware systems
<br>

### 4.2 Testing incorrect password login scenario

#### Test Performed:
```
- Endpoint: POST /auth/login

- Correct email, incorrect password
```
#### Request Body:
```
{
  "email": "user@test.com",
  "password": "wrongpassword"
}
```

#### Result:
```
{
  "error": "Invalid credentials"
}
```

#### Status Code: `401 Unauthorized`

#### Explanation:
#### The password comparison using bcrypt.compare() fails, preventing login.


## 9.0 Conclusion
#### - This lab successfully demonstrated the development of a secure RESTful Ride-Hailing API using Express.js and MongoDB.
#### - JWT authentication and role-based authorization were implemented to ensure secure access.
#### - All APIs were tested using Postman and validated with appropriate HTTP status codes.