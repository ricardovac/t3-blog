import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { trpc } from "../utils/trpc";

function PostListing() {
  const { data, isLoading } = trpc.post.allPost.useQuery();

  if (isLoading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center font-space">
      {data?.map((posts: any) => {
        return (
          <article
            key={posts.id}
            className="m-2 w-2/4 scale-100 overflow-hidden rounded-md border-2 border-zinc-500 p-4 shadow duration-200 ease-in hover:shadow-md hover:shadow-zinc-700"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-extrabold text-white">
                {posts.title}
              </h1>
              <img
                src={posts.user.image}
                alt="Profile"
                className="w-10 rounded-full"
              />
            </div>
            <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-white opacity-25">
              {posts.body}
            </p>
            <Link
              href={`/posts/${posts.id}`}
              className="flex items-center justify-between text-zinc-200"
            >
              <div className="flex items-center gap-1 duration-100 ease-in hover:scale-105">
                <span className="">Read post </span>
                <AiOutlineArrowRight />
              </div>
              <p>{posts.user.name}</p>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
export default PostListing;
