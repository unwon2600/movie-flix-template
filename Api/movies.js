import { connectDB } from "./_db.js";

export default async function handler(req, res) {
  const db = await connectDB();
  const movies = await db.find().sort({ created_at: -1 }).toArray();
  res.json(movies);
}
