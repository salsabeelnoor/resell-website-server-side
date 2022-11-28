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
    const productCollection = client.db("resellWebsite").collection("products");
    const categoryCollection = client
      .db("resellWebsite")
      .collection("categories");

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

    //get categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    //get categories/:id
    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const category = await categoryCollection.findOne(query);
      res.send(category);
    });

    //create product
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //get products
    app.get("/products", async (req, res) => {
      let query = {};

      if (req.query.category) {
        query = { category: req.query.category };
      }

      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //delete product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          advertise: true,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
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
