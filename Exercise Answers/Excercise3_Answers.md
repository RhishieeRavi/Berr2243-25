# Exercise Questions & Answers — Week Week 3 Building a Ride-Hailing REST API with Express.js

## 1. POST Request

### Postman: POST Request
![Postman POST Screenshot](../Screenshots/PostmanPOST.png)


- **HTTP Status Code:** 201 Created  
- **Response Body Example:**
  ```json
  {
    "id": "6902cf09abcbce9d6ac5c00"
  }
  ```

## 2. GET Request

### Postman: Empty GET
![Postman POST Screenshot](../Screenshots/PostmanGETExercise.png)

  - **What happens if the rides collection is empty?**: Returns [ ]


### Postman: GET Request
![Postman POST Screenshot](../Screenshots/PostmanGET.png)

  - **What data type is returned in the response (array/object)?**: Array of objects

## 3. Fix PATCH and DELETE Error:


### Postman: PATCH Request with invalid ID format
![Postman POST Screenshot](../Screenshots/PostmanPATCHInvalid.png)
- **Catch the error when requesting PATCH or DELETE API, then try to fix the issue reported.**

#### When I intentionally sent a PATCH or DELETE request with an **invalid ride ID** (e.g., `http://localhost:3000/rides/123`),  
the server threw this error in the console:

```json
{
  "error": "Invalid ride ID or data"
}
```
#### This happens because "123" is not a valid MongoDB ObjectId format.

#### The error was caught using the try { ... } catch (err) { ... } block inside the Express route:

```
catch (err) {
  console.error("PATCH Error:", err.message);
  res.status(400).json({ error: "Invalid ride ID or data" });
}
```

#### Fix: Use a real _id from an existing ride document (copied from GET /rides).

### Postman: PATCH Request with invalid ID
![Postman POST Screenshot](../Screenshots/PostmanPATCHError.png)


- **If you try to update a non-existent ride ID, what status code is returned?**

#### When I intentionally sent a PATCH request with an **invalid ride ID** (`http://localhost:3000/rides/7902d1e20abcbce9d6ac5c01`), 
the server threw this error in the console:

```json
{
  "error": "Invalid ride ID or data"
}
```

#### Status Code: 404 Not Found

### Postman: Fixed PATCH Request
![Postman POST Screenshot](../Screenshots/PostmanPATCH.png)

- **What is the value of updated in the response if the update succeeds?**

```json
{
  "updated": 1
}
```

#### Status Code: 200 OK


### Postman: Valid DELETE Request
![Postman POST Screenshot](../Screenshots/PostmanDELETE.png)
### Postman: Invalid DELETE Request
![Postman POST Screenshot](../Screenshots/PostmanDELETEInvalid.png)
- **How does the API differentiate between a successful deletion and a failed one?**

#### For DELETE, the route checks result.deletedCount to determine what happened.
#### Successful deletion:
```json
{
  "deleted": 1
}
```
#### Shows rider is deleted.

#### Failed deletion:
```json
{
  "error": "Invalid ride ID"
}
```
#### Returns 404 Not Found.

#### Within the code:
```
if (result.deletedCount === 0) {
  return res.status(404).json({ error: "Ride not found" });
}
res.status(200).json({ deleted: result.deletedCount });
```
#### The API differentiates success/failure using the deletedCount property of MongoDB’s result.

## 4. Users Endpoints:
- **Based on the exercise above, create the endpoints to handle the CRUD operations for users account**