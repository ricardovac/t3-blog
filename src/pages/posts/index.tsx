import Link from "next/link";
import { trpc } from "../../utils/trpc";

function PostListingPage() {
  const { data, isLoading } = trpc.post.allPost.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data?.map((posts) => {
        return (
          <article key={posts.id}>
            <p>{posts.title}</p>
            <Link href={`/posts/${posts.id}`}>Read post</Link>
          </article>
        );
      })}
    </div>
  );
}
export default PostListingPage;
