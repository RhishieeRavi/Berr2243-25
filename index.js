const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors()); // ✅ Allow frontend and Postman access

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

// GET /rides/:id - Track ride by ID
app.get('/rides/:id', async (req, res) => {
  try {
    const ride = await db.collection('rides').findOne({ _id: new ObjectId(req.params.id) });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.status(200).json(ride);
  } catch (err) {
    res.status(400).json({ error: "Invalid ride ID" });
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

// ---------------- Week 4 APIs ----------------

// Customer Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email, password, role: "customer" });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

// Customer View Profile
app.get('/users/:id', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});

//Driver Login
app.post('/driver/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await db.collection('users').findOne({ email, password, role: "driver" });
    if (!driver) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Driver login successful", driver });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

// Driver Update Availability
app.patch('/drivers/:id/status', async (req, res) => {
  try {
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id), role: "driver" },
      { $set: { status: req.body.status } }
    );

    if (result.modifiedCount === 0) return res.status(404).json({ error: "Driver not found" });

    res.status(200).json({ updated: 1 });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID or data" });
  }
});

// Driver View Earnings
app.get('/drivers/:id/earnings', async (req, res) => {
  try {
    // for lab demo only
    res.status(200).json({ driverId: req.params.id, earnings: "RM560.00" });
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

// Admin Login
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await db.collection('users').findOne({ email, password, role: "admin" });
    if (!admin) return res.status(401).json({ message: "Invalid admin credentials" });

    res.status(200).json({ message: "Admin login successful", admin });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

// Admin Block User
app.delete('/admin/users/:id', async (req, res) => {
  try {
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "blocked" } }
    );

    if (result.modifiedCount === 0) return res.status(404).json({ error: "User not found" });

    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// Admin View System Analytics
app.get('/admin/analytics', async (req, res) => {
  const userCount = await db.collection('users').countDocuments();
  const rideCount = await db.collection('rides').countDocuments();

  res.status(200).json({ totalUsers: userCount, totalRides: rideCount });
});



// Start server (must be last)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});