import { getConnection } from "../connection";

interface Post {
  id: number;
  text: string;
  author: string;
  created_at: string;
}

export async function getServerSideProps() {
  const conn = await getConnection();
  const data = await conn.query("SELECT * FROM posts");
  const posts = data[0];

  return {
    props: {
      posts: (posts as []).map((post: Post) => ({
        id: post.id,
        text: post.text,
        author: post.author,
        created_at: post.created_at.toString(),
      })),
    },
  };
}

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {posts.map((post: any) => (
        <div key={post.id}>{post.text}</div>
      ))}
    </main>
  );
}
