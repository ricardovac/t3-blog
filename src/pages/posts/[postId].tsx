import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

function SinglePostPage() {
  const router = useRouter();

  const postId = router.query.postId as string;

  const { data, isLoading } = trpc.post.singlePost.useQuery({ postId });
  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <div className="mx-auto flex w-full flex-col items-center justify-center text-white">
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-4xl font-extrabold">{data?.title}</h1>
          <p>{data?.body}</p>
          <Link href="/">
            <button className="hover rounded border p-2 text-white hover:bg-zinc-800">
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default SinglePostPage;
