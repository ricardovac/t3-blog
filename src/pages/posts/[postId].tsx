import Error from "next/error";
import { useRouter } from "next/router";
import CommentSection from "../../components/CommentSection";
import { trpc } from "../../utils/trpc";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useState } from "react";

const formatNumber = (num: number) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

const SinglePostPage = () => {
  const router = useRouter();
  const session = useSession();
  const postId = router.query.postId as string;
  const { data, isLoading } = trpc.post.singlePost.useQuery({ postId });
  const [isCurrentlyLiked, setIsCurrentLiked] = useState(data?.likedByMe)

  const likeCountQuery = trpc.post.countVotes.useQuery(
    { postId: data?.id! },
    { initialData: { count: data?._count?.Upvote } }
  )

  const likeMutation = trpc.post.upVote.useMutation()

  const toggleLike = () => {
    if (!session.data?.user) {
      console.log("You need to login")
    } else {
      likeMutation.mutateAsync({
        isLiked: !isCurrentlyLiked,
        postId,
      }).then(() => {
        likeCountQuery.refetch();
      }).catch((err) => {
        console.log(err)
      });
      setIsCurrentLiked(!isCurrentlyLiked)
    }
  }


  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  const VoteClass = "cursor-pointer hover:text-zinc-400 text-zinc-500";

  return (
    <div>
      <div className="flex min-h-screen bg-zinc-900">
        <div className="mx-auto flex w-full flex-col items-center justify-center font-space text-white">
          <div className="mt-8 flex w-2/4 flex-col gap-4 p-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => toggleLike()}
                >
                  <AiOutlineCaretUp size={25} className={`${isCurrentlyLiked ? "text-zinc-500" : ""}`} />
                </button>
                <span className="text-xs font-semibold">{formatNumber(likeCountQuery.data?.count!)}</span>

                <AiOutlineCaretDown size={25} className={VoteClass} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold">{data.title}</h1>
                <p>{data.body}</p>
              </div>
            </div>
            <CommentSection />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SinglePostPage;
