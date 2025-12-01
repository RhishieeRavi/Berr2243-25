require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

app.use((req, res, next) => {
  if (!db) return res.status(503).json({ error: "Database not ready" });
  next();
});


const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

// GET /rides - Fetch all rides
app.get('/rides', authenticate, async (req, res) => {
  try {
    const rides = await db.collection('rides').find().toArray();
    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

// POST /rides - Create a new ride
app.post('/rides', authenticate, async (req, res) => {
  try {
    const result = await db.collection('rides').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ error: "Invalid ride data" });
  }
});

// GET /rides/:id - Track ride by ID
app.get('/rides/:id', authenticate, async (req, res) => {
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
app.patch('/rides/:id', authenticate, async (req, res) => {
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
app.delete('/rides/:id', authenticate, async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "customer",
      status: "active"
    };

    await db.collection('users').insertOne(user);
    res.status(201).json({ message: "User created" });

  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// READ all users (GET)
app.get('/users', authenticate, authorize(['admin']), async (req, res) => {
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

// Customer View Profile
app.get('/users/:id', authenticate, async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});


// Driver Update Availability
app.patch('/drivers/:id/status', authenticate, authorize(['driver']), async (req, res) => {
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
app.get('/drivers/:id/earnings', authenticate, authorize(['driver']), async (req, res) => {
  try {
    // for lab demo only
    res.status(200).json({ driverId: req.params.id, earnings: "RM560.00" });
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

// Admin Block User
app.delete('/admin/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.post('/auth/login', async (req, res) => {
  const user = await db.collection('users').findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({ token });
});


// Admin View System Analytics
app.get('/admin/analytics', authenticate, authorize(['admin']), async (req, res) => {
  const userCount = await db.collection('users').countDocuments();
  const rideCount = await db.collection('rides').countDocuments();

  res.status(200).json({ totalUsers: userCount, totalRides: rideCount });
});



// Start server (must be last)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});