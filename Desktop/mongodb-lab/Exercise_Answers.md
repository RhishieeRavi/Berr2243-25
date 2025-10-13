# Exercise Questions & Answers — Week 1 Hello MongoDB

## 1. Code Execution & Output

**Console Output:**

```
$ node index.js
Connected to MongoDB!
Document inserted!
Query result: {
  _id: new ObjectId('68e7483ba542566278f402c8'),
  name: 'Alice',
  age: 25
}
```

## 2. Modify and Observe

```
Connected to MongoDB!
Document inserted!
Query result: {
  _id: new ObjectId('68e7483ba542566278f402c8'),
  name: 'Rhishiee',
  age: 23
}
```

**Error (without `await client.connect()`): 
```
MongoNotConnectedError: MongoClient must be connected to perform this operation
```

## 3. MongoDB Connection Failure

**Change port to:** `27018`

Error Message:
```
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27018
```

## 4. MongoDB Shell Query

**Commands used:**
```
mongosh
use testDB
db.users.find().pretty()
```
Output:
```
[
  { "_id": ObjectId("68e7483ba542566278f402c8"), "name": "Alice", "age": 25 },
  { "_id": ObjectId("68e74b9ca542566278f402e1"), "name": "Rhishiee", "age": 23 }
]
```

## 5. File System and Dependencies

Absolute path:
```
C:\Users\Rhishiee\Desktop\mongodb-Lab\package-lock.json
```
MongoDB driver version: `6.9.0`

## 6. Troubleshooting Practice

Error when MongoDB stopped: 
```
Error: connect ECONNREFUSED 127.0.0.1:27018
```

Restart command: 
```
mongod.exe --dbpath C:\data\db
```

## 7. GitHub Repository Structure

Last commit timestamp: 12 hours ago
Files in branch: `index.js`, `.gitignore`, `README.md`, `package.json`, `package-lock.json`, `Exercise_Answers.md`

## 8. Performance Observation

Time to connect: `~60ms`
Repeat performance: Slightly faster due to cached connection.
