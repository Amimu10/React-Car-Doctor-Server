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
app.use(cors());
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