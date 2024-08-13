const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
// const jwt = require("jsonwebtoken"); 
// const cookieParser = require("cookie-parser"); 
const port = process.env.PORT || 3000;

// React-Car-Doctor
// 0VMxQp2y1U5AuPXB

// middleware
app.use(cors({
  origin : [
        "http://localhost:5173"
  ],
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.s1nii.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const serviceCollection = client.db("carDoctor").collection("services");
const bookingCollection = client.db("carDoctor").collection("bookings");


// service related api 

app.get("/services", async (req, res) => {
   const cursor = serviceCollection.find(); 
   const result = await cursor.toArray();
    res.send(result);

})

app.get("/services/:id", async (req, res) => {
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}; 
  // const options = {
  //   projection: { _id: 1, title: 1, price: 1, description: 1, img: 1, facility: 1}, 
  // }
  const result = await serviceCollection.findOne(query);
    res.send(result);

})

// booking relaated api

app.get("/bookings", async(req, res) => {
  console.log(req.query.email);
   let query = {}; 
   if(req.query?.email){
      query = { email: req.query.email}
   }
    const cursor = bookingCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
})

app.post("/bookings", async (req, res) => {
   const checkout = req?.body;
   console.log(checkout);
    const result = await bookingCollection.insertOne(checkout);
    res.send(result); 
})

app.patch("/bookings/:id", async(req, res) => {
     const id = req.params.id;
     const filter = {_id: new ObjectId(id)}
     const updatedBooking = req?.body; 
     console.log(updatedBooking);
     const updateDoc = {
        $set: {
            status: updatedBooking.status
        },
     }
     const result = await bookingCollection.updateOne(filter, updateDoc);
     res.send(result);
})

app.delete("/bookings/:id", async (req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const booking = await bookingCollection.deleteOne(query);
    res.send(booking);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    console.log("crud is running...");
})

app.listen(port, () => {
    console.log(`car doctor server is running  on port ${port}`);
})