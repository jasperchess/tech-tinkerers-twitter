import { getConnection } from "@/connection";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connection = await getConnection();

  if (req.method === "POST") {
    const { text } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO posts (text, author) VALUES (?, ?)",
      [text, process.env.DISPLAY_NAME]
    );
    const [post] = await connection.execute(
      "SELECT * FROM posts WHERE id = ?",
      [(result as any).insertId]
    );
    res.status(200).json(post);
  }
}
