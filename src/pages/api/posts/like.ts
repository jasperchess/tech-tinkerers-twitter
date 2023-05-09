import { getConnection } from "@/connection";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connection = await getConnection();

  if (req.method === "POST") {
    const { id } = req.body;
    const [post] = await connection.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = ?",
      id
    );
    res.status(200).json({
      success: true,
    });
  }
}
