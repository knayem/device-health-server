const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;

const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
console.log(process.env.DB_USER)
const port = process.env.PORT || 5055;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send("As-Salaam-Alaikum,")
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tn7le.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err)
  const serviceCollection = client.db("bServicedb").collection("services");
  const bookCollection = client.db("bServicedb").collection("books");
  const reviewCollection = client.db("bServicedb").collection("reviews");
  const adminCollection = client.db("bServicedb").collection("admins");

  app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})
  
app.get('/services/:id', (req, res) => {
  //console.log(req.params.id);
serviceCollection.find({_id: ObjectId(req.params.id)})
.toArray( (err, documents) => {
  console.log(documents)
    res.send(documents[0]);
})
})

  
  
  app.post('/addService', (req, res) => {

    const newService = req.body;
    console.log('adding new service:' , newService)

    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count:', result)
      res.send(result.insertedCount >0)
 })

  })

  
  app.post('/addBook' , (req, res) => {
    const newBook = req.body;
    console.log(newBook);
    bookCollection.insertOne(newBook) 
    .then(result => {
         //console.log('inserted count:', result)
         res.send(result.insertedCount >0)
    })
    })


    app.post('/addReview' , (req, res) => {
      const newReview = req.body;
      console.log(newReview);
      reviewCollection.insertOne(newReview) 
      .then(result => {
           //console.log('inserted count:', result)
           res.send(result.insertedCount >0)
      })
      })


      app.get('/reviews', (req, res) => {
        reviewCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })



         app.post('/makeAdmin' , (req, res) => {
         const newAdmin = req.body;
         console.log(newAdmin);
       adminCollection.insertOne(newAdmin) 
         .then(result => {
              //console.log('inserted count:', result)
              res.send(result.insertedCount >0)
         })
         })
  


    app.delete('/deleteService/:id', (req,res) =>{


      serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
      
      .then(result =>{
      
           console.log(result.insertedCount >0)
      
      })
      
      })






  console.log('Database connection successfully')

});






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})