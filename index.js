//initializing
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6mxxl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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

    const productCollection = client.db("productDB").collection("product");
    const addCollection = client.db("productDB").collection("addtocart");


    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })


    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          rating: updatedProduct.rating,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          price: updatedProduct.price,
          photo: updatedProduct.photo
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    })



    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    //add to cart section
    app.get("/addtocart", async (req, res) => {
      const cursor = addCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/addtocart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addCollection.findOne(query);
      res.send(result);
    })

    app.post("/addtocart", async (req, res) => {
      const addToNewProduct = req.body;
      console.log(addToNewProduct);
      const result = await addCollection.insertOne(addToNewProduct);
      res.send(result);
    })


    app.put("/addtocart/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const addCart = req.body;
      const addCartProduct = {
        $set: {
          name: addCart.name,
          rating: addCart.rating,
          brand: addCart.brand,
          type: addCart.type,
          price: addCart.price,
          photo: addCart.photo
        }
      }
      const result = await addCollection.updateOne(filter, addCartProduct, options);
      res.send(result);
    })

    app.delete("/addtocart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addCollection.deleteOne(query);
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
  res.send("Technology and Electronics server is running")
})

app.listen(port, () => {
  console.log((`Technology and Electronics server is running on port: ${port}`))
})