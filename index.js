const { MongoClient } = require('mongodb');

const drivers = [
  { 
    name: "John Doe", 
    vehicleType: "Sedan", 
    isAvailable: true, 
    rating: 4.8 
  },
  { name: "Alice Smith", 
    vehicleType: "SUV", 
    isAvailable: false, 
    rating: 4.5 
  }
];

// Show the data in console
console.log("All drivers:", drivers);

// TODO: show all driver names
drivers.forEach(driver => console.log("Driver name:", driver.name));

// TODO: add additional driver
drivers.push({ name: "Rhishiee Ravi", vehicleType: "Hatchback", isAvailable: true, rating: 4.7 });

async function main() {
  // Replace <connection-string> with your MongoDB URI
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("testDB");
    const collection = db.collection("users");

    // Insert a document
    await collection.insertOne({ name: "Rhishiee", age: 25 });
    console.log("Document inserted!");

    // Query the document
    const result = await collection.findOne({ name: "Rhishiee" });
    console.log("Query result:", result);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

main();
