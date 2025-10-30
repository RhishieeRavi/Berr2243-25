const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const port = 3000;
const app = express();
app.use(express.json());

let db;

async function connectToMongoDB() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    db = client.db("testDB");
  } catch (err) {
    console.error("Error:", err);
  }
}

connectToMongoDB();

// GET /rides - Fetch all rides
app.get('/rides', async (req, res) => {
  try {
    const rides = await db.collection('rides').find().toArray();
    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

// POST /rides - Create a new ride
app.post('/rides', async (req, res) => {
  try {
    const result = await db.collection('rides').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ error: "Invalid ride data" });
  }
});

// PATCH /rides/:id - Update ride status
app.patch('/rides/:id', async (req, res) => {
  try {
    const result = await db.collection('rides').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }
    res.status(200).json({ updated: result.modifiedCount });
  } catch (err) {
    //Handle invalid ID format or DB errors
    res.status(400).json({ error: "Invalid ride ID or data" });
  }
});

// DELETE /rides/:id - Cancel a ride
app.delete('/rides/:id', async (req, res) => {
  try {
    const result = await db.collection('rides').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }
    res.status(200).json({ deleted: result.deletedCount });

  } catch (err) {
    res.status(400).json({ error: "Invalid ride ID" });
  }
});

// ---------------- USER CRUD ENDPOINTS ----------------

// CREATE user (POST)
app.post('/users', async (req, res) => {
  try {
    const result = await db.collection('users').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error("POST /users Error:", err.message);
    res.status(400).json({ error: "Invalid user data" });
  }
});

// READ all users (GET)
app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error("GET /users Error:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// UPDATE user (PATCH)
app.patch('/users/:id', async (req, res) => {
  try {
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ updated: result.modifiedCount });
  } catch (err) {
    console.error("PATCH /users Error:", err.message);
    res.status(400).json({ error: "Invalid user ID or data" });
  }
});

// DELETE user (DELETE)
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await db.collection('users').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ deleted: result.deletedCount });
  } catch (err) {
    console.error("DELETE /users Error:", err.message);
    res.status(400).json({ error: "Invalid user ID" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});