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
    const useCollection = client.db("resellWebsite").collection("users");

    //create users
    app.post("/users", async (req, res) => {
      const customers = req.body;
      console.log(customers);
      const result = await useCollection.insertOne(customers);
      res.send(result);
    });

    //get users
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = useCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //get users
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const users = await useCollection.findOne(query);
      res.send(users);
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
