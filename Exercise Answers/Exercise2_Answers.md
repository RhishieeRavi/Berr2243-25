# Exercise Questions & Answers — Week 2 JSON

## 1. CRUD Operations 
 

**CRUD stands for:**   

Create → `insertOne()` or `insertMany()` adds new documents to a collection.

Read → `find()` or `findOne()` retrieves documents based on a query.

Update → `updateOne()` or `updateMany()` modifies existing documents.

Delete → `deleteOne()` or `deleteMany()` removes documents from a collection.  


**In the exercise:**  

`insertOne()` was used to create driver documents.

`find()` was used to read drivers that are available.

`updateOne()` then `updateMany()` was used to update driver ratings.

`deleteOne()` then `deleteMany()` was used to delete unavailable drivers.  

## 2. MongoDB Operators Used  

| Operator | Description | Example | Usage in Code |
|-----------|--------------|----------|----------------|
| `$gte` | Greater than or equal to | `{ rating: { $gte: 4.5 } }` | Finds drivers with rating ≥ 4.5 |
| `$inc` | Increment a numeric value | `{ $inc: { rating: 0.1 } }` | Increases John Doe’s rating by 0.1 |

## 3. Difference between updateOne and updateMany

In the exercise, `updateOne()` was first used to modify only **one document** (the first match).  
When replaced with `updateMany()`, **all documents** matching the condition are updated.

| Function | Description | Example | Output Difference |
|-----------|--------------|----------|-------------------|
| `updateOne()` | Updates the first document that matches the filter. | `{ name: "John Doe" }` | Only one document's rating increases. |
| `updateMany()` | Updates all documents that match the filter. | `{ name: "John Doe" }` | Every "John Doe" document in the collection has its rating increased. |

**Observation:**  
In MongoDB Compass, you can see multiple "John Doe" entries now have a rating increased by +0.1 instead of just one.

## 4. DeleteMany vs DeleteOne  

`deleteOne()` removes **only the first** document that matches the condition,  
while `deleteMany()` removes **all** documents that match.

| Function | Description | Example | Output Difference |
|-----------|--------------|----------|-------------------|
| `deleteOne()` | Deletes one document that matches `{ isAvailable: false }`. | `deleteOne({ isAvailable: false })` | Only one unavailable driver is removed. |
| `deleteMany()` | Deletes all documents that match `{ isAvailable: false }`. | `deleteMany({ isAvailable: false })` | All unavailable drivers are deleted from the collection. |

**Observation:**  
After using `deleteMany()`, no drivers with `isAvailable: false` remain in MongoDB Compass.
