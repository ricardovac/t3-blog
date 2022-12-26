import { useRouter } from "next/router";
import React from "react";
import formComments from "../helpers/formatComment";
import { trpc } from "../utils/trpc";
import CommentForm from "./CommentForm";
import CommentListing from "./CommentListing";

function CommentSection() {
  const router = useRouter();
  const postId = router.query.postId as string;

  const { data } = trpc.comment.allComments.useQuery({ postId });

  return (
    <div>
      <CommentForm />
      {data && <CommentListing comments={formComments(data) || []} />}
    </div>
  );
}

export default CommentSection;
