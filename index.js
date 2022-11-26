const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jvabeue.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//database api
async function run() {
  try {
    const buyerCollection = client.db("resellWebsite").collection("buyers");
    const sellerCollection = client.db("resellWebsite").collection("sellers");

    //create buyers
    app.post("/buyers", async (req, res) => {
      const customers = req.body;
      console.log(customers);
      const result = await buyerCollection.insertOne(customers);
      res.send(result);
    });
    //create sellers
    app.post("/sellers", async (req, res) => {
      const customers = req.body;
      console.log(customers);
      const result = await sellerCollection.insertOne(customers);
      res.send(result);
    });
  } catch {}
}

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Resell Website server running");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
