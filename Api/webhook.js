import { connectDB } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = req.query.secret;
  if (secret !== process.env.WEBHOOK_SECRET)
    return res.status(403).json({ error: "Forbidden" });

  const update = req.body;
  const post = update.channel_post || update.edited_channel_post;
  if (!post) return res.status(200).end();

  const db = await connectDB();

  const channel_username = post.chat?.username || null;
  const messageId = post.message_id;

  const caption = post.caption || post.text || "";
  const lines = caption.split("\n");
  const title = lines[0]?.trim() || `Post ${messageId}`;
  const description = lines.slice(1).join("\n").trim();

  let file_id = null,
    poster_id = null,
    file_type = null;

  if (post.photo) {
    const largest = post.photo[post.photo.length - 1];
    poster_id = largest.file_id;
    file_id = largest.file_id;
    file_type = "photo";
  } else if (post.document) {
    file_id = post.document.file_id;
    file_type = "document";
    poster_id = post.document.thumb?.file_id || null;
  } else if (post.video) {
    file_id = post.video.file_id;
    file_type = "video";
    poster_id = post.video.thumb?.file_id || null;
  } else {
    return res.status(200).end();
  }

  await db.insertOne({
    telegram_message_id: messageId,
    channel_username,
    title,
    description,
    file_id,
    poster_id,
    file_type,
    created_at: new Date(),
  });

  return res.status(200).json({ ok: true });
}
