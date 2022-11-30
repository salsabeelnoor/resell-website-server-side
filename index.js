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
    const bookingCollection = client.db("resellWebsite").collection("bookings");
    const wishListCollection = client
      .db("resellWebsite")
      .collection("wishlists");

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

    //update user
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          verified: true,
        },
      };
      const result = await useCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    //delete seller
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await useCollection.deleteOne(query);
      res.send(result);
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

    //get products by email
    app.get("/products/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const products = await productCollection.find(query).toArray();
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

    //post bookings
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        bookedProductId: booking.bookedProductId,
        buyerEmail: booking.buyerEmail,
      };

      const alreadyBooked = await bookingCollection.find(query).toArray();

      if (alreadyBooked.length) {
        const message = `You already have a booking on ${booking.bookedProductName}`;
        return res.send({ acknowledged: false, message });
      }

      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    //get bookings by email
    app.get("/bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    //delete booking
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    //post wishList
    app.post("/wishlists", async (req, res) => {
      const wishList = req.body;
      const query = {
        productId: wishList.productId,
        buyerEmail: wishList.buyerEmail,
      };

      const alreadyBooked = await bookingCollection
        .find({
          bookedProductId: req.body.productId,
          buyerEmail: req.body.buyerEmail,
        })
        .toArray();
      const alreadyWishListed = await wishListCollection.find(query).toArray();

      if (alreadyBooked.length) {
        const message = `You already have a booking on ${wishList.productName}`;
        return res.send({ acknowledged: false, message });
      }

      if (alreadyWishListed.length) {
        const message = `You already have wishlisted ${wishList.productName}`;
        return res.send({ acknowledged: false, message });
      }

      const result = await wishListCollection.insertOne(wishList);
      res.send(result);
    });

    //get bookings by email
    app.get("/wishlists/:email", async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email };
      const wishlists = await wishListCollection.find(query).toArray();
      res.send(wishlists);
    });

    //delete booking
    app.delete("/wishlists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wishListCollection.deleteOne(query);
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
