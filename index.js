const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




// const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.twtll.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.17mhv8n.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('scottPgotography').collection('services');
        const reviewsCollection = client.db('scottPgotography').collection('reviews');

        app.get('/services-home', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).sort({"_id":-01});
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });



    // reviews system
    app.get("/reviews", async (req, res) => {
        let query = {};
        if (req.query.email) {
          query = {
            email: req.query.email,
          };
        }
        const cursor = reviewsCollection.find(query).sort({"_id":-01});
        const reviews = await cursor.toArray();
        res.send(reviews);
      });


    app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await reviewsCollection.findOne(query);
            res.send(service);
            
        });
  
      // add new review
      app.post("/add-review", async (req, res) => {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      });

      //Edit review
      app.put('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const status = req.body;
        const option = {upsert: true};
        const updatedReview = {
            $set: {
                review: status.review
            }
        }
        const result = await reviewsCollection.updateOne(filter, updatedReview, option);
        res.send(result);
    })


    //Add Service
    app.post("/services", async (req, res) => {
        const review = req.body;
        const result = await serviceCollection.insertOne(review);
        res.send(result);
      });
    } 
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Hello, Server is running....')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})