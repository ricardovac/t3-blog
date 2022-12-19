import Error from "next/error";
import { useRouter } from "next/router";
import CommentSection from "../../components/CommentSection";
import { trpc } from "../../utils/trpc";

function SinglePostPage() {
  const router = useRouter();
  const permalink = router.query.permalink as string;

  const { data, isLoading } = trpc.post.findByPermalink.useQuery({ permalink });
  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <div className="mx-auto flex w-full flex-col items-center justify-center text-white">
        <div className="mt-8 flex w-2/4 flex-col gap-4 p-4">
          <h1 className="text-4xl font-extrabold">{data?.title}</h1>
          <p>{data?.body}</p>
          <CommentSection />
        </div>
      </div>
    </div>
  );
}
export default SinglePostPage;
