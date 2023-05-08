import { getConnection } from "./connection"

interface Post {
  id: number
  text: string
  author: string
  created_at: string
}

const getPosts = async () => {
  const conn = await getConnection()
  const data = await conn.query('SELECT * FROM posts')
  return data[0] as Post[]
}

export default async function Home() {
  const data = await getPosts()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {data.map((post: any) => <div key={post.id}>{post.text}</div>)}
    </main>
  )
}
