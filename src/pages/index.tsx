import { getConnection } from "@/connection";
import dayjs from "dayjs";
import { FormEvent } from "react";

interface Post {
  id: number;
  text: string;
  author: string;
  likes: number;
  created_at: string;
}

interface DBPost {
  id: number;
  text: string;
  author: string;
  likes: number;
  created_at: Date;
}

export async function getServerSideProps() {
  const connection = await getConnection();
  const [posts] = await connection.query(`SELECT * FROM posts`);

  return {
    props: {
      posts: (posts as DBPost[]).map((post) => ({
        ...post,
        created_at: post.created_at.toDateString(),
      })),
    },
  };
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  const likePost = (id: number) => async () => {
    await fetch("/api/posts/like", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    window.location.reload();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        text: formData.get("text"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    window.location.reload();
  };

  return (
    <main className="bg-red-400 pt-10 flex flex-col justify-center items-center py-16 space-y-4">
      {process.env.NODE_ENV === "development" && (
        <form onSubmit={handleSubmit} className="flex w-1/2 space-x-4">
          <input
            placeholder="Enter your tweet"
            type="text"
            name="text"
            className="px-4 py-2 rounded-lg grow"
          />
          <button
            className="rounded-lg bg-red-300 shadow-md px-4 py-2"
            type="submit"
          >
            Post
          </button>
        </form>
      )}
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="bg-white p-4 rounded-2xl w-1/2 shadow-xl"
          >
            <div className="flex justify-between">
              <p className="font-bold">{post.author}</p>
              <p>{dayjs(post.created_at).format("DD MMM YYYY")}</p>
            </div>
            <p>{post.text}</p>
            <button onClick={likePost(post.id)}>
              <span>❤️ {post.likes}</span>
            </button>
          </div>
        );
      })}
    </main>
  );
}
