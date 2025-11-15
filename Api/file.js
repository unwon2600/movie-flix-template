import axios from "axios";

export default async function handler(req, res) {
  const file_id = req.query.id;
  if (!file_id) return res.status(400).end();

  const token = process.env.TELEGRAM_BOT_TOKEN;

  try {
    const gf = await axios.get(
      `https://api.telegram.org/bot${token}/getFile`,
      { params: { file_id } }
    );

    if (!gf.data.ok) return res.status(404).end();
    const filePath = gf.data.result.file_path;

    const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
    return res.redirect(fileUrl);
  } catch (e) {
    return res.status(500).json({ error: "file error" });
  }
}
