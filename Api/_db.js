import { MongoClient } from "mongodb";

let client = null;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
  }
  return client.db("movieflix").collection("movies");
}
