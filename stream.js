import { MongoClient } from "mongodb"
const mongouri='mongodb://contact:My9J9xnpsYSRnH6@cluster0-shard-00-00.ncmj4.mongodb.net:27017,cluster0-shard-00-01.ncmj4.mongodb.net:27017,cluster0-shard-00-02.ncmj4.mongodb.net:27017/shannonDatabase?ssl=true&replicaSet=atlas-10vj3b-shard-0&authSource=admin&retryWrites=true&w=majority'

// Replace the uri string with your MongoDB deployment's connection string.

const client = new MongoClient(mongouri);

let changeStream;
async function changeEvent(hello,req, res) {

    // console.log("Received change:\n", hello);

  try {
    const database = client.db("shannonDatabase");
    const haikus = database.collection("infos");

    // Open a Change Stream on the "haikus" collection
    changeStream = haikus.watch();
    console.log("Received change:\n",changeStream);

    // return   res.status(200).json({ stream: changeStream })

    // Print change events
    for await (const change of changeStream) {

      console.log("Received change:\n", change.fullDocument);
    }

    await changeStream.close();
    
  } finally {
    await client.close();
  }
}
export default changeEvent
