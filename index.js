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
    const db = client.db("testDB");

    const driversCollection = db.collection("drivers");

    for (const driver of drivers) 
      {
      const result = await driversCollection.insertOne(driver);
      console.log("New driver created with result:", result);    
    } 

    const availableDrivers = await db.collection('drivers').find({
      isAvailable: true,
      rating: { $gte: 4.5 }
    }).toArray();
    console.log("Available drivers:", availableDrivers);

    const updateResult = await db.collection('drivers').updateMany(
      { name: "John Doe" },
      { $inc: { rating: 0.1 } }
    );
    console.log("Driver updated with result:", updateResult);

    const deleteResult = await db.collection('drivers').deleteMany({ isAvailable: false });
    console.log("Driver deleted with result:", deleteResult);

  } finally {
    await client.close();
  }
}

main();
