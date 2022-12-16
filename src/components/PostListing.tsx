import Link from "next/link";
import { trpc } from "../utils/trpc";
import { AiOutlineArrowRight } from "react-icons/ai";

function PostListingPage() {
  const { data, isLoading } = trpc.post.allPost.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center">
      <div className="flex w-2/4 rounded">
        <Link href="/posts/new">
          <h1 className="hover rounded border p-2 text-white hover:bg-zinc-800">
            Create Post
          </h1>
        </Link>
      </div>
      {data?.map((posts) => {
        return (
          <article
            key={posts.id}
            className="m-2 w-2/4 scale-100 overflow-hidden rounded-md border-4 border-zinc-500 p-4 shadow duration-500 ease-in hover:scale-105 hover:shadow-md hover:shadow-zinc-700"
          >
            <h1 className="text-4xl font-extrabold text-white">
              {posts.title}
            </h1>
            <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-white opacity-25">
              {posts.body}
            </p>
            <Link
              href={`/posts/${posts.id}`}
              className="flex items-center gap-1 text-zinc-200"
            >
              <span>Read post </span>
              <AiOutlineArrowRight />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
export default PostListingPage;
