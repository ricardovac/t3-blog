import { useRouter } from "next/router";
import React from "react";
import formComments from "../helpers/formatComment";
import { trpc } from "../utils/trpc";
import CommentForm from "./CommentForm";
import CommentListing from "./CommentListing";

function CommentSection() {
  const router = useRouter();
  const permalink = router.query.permalink as string;

  const { data } = trpc.comment.allComments.useQuery({ permalink });

  return (
    <div>
      <CommentForm />
      {data && <CommentListing comments={formComments(data) || []} />}
    </div>
  );
}

export default CommentSection;
