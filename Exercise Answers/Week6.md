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
![Postman POST Screenshot](../Screenshots/CustomerRegistration.png)
<br>

### 2. Customer Login (JWT Token Generated)
![Postman POST Screenshot](../Screenshots/CustomerLogin.png)
<br>

### 3. Book Ride
![Postman POST Screenshot](../Screenshots/CustomerLogin.png)
<br>