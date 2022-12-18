import { useRouter } from "next/router";
import React from "react";
import { Comment as CommentWithChildren, trpc } from "../utils/trpc";

function Comment({ comment }: { comment: CommentWithChildren }) {
  const fixedImg = comment.user.image as string | undefined;

  return (
    <article className="mb-6 rounded-lg bg-transparent py-6 px-4 text-base border border-zinc-800">
      <footer className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm text-white">
            <img
              className="mr-2 h-6 w-6 rounded-full"
              src={fixedImg}
              alt="Profile picture"
            />
            {comment.user.name}
          </p>
          <p className="text-sm text-gray-600 ">
            <time title="February 8th, 2022">
              {comment.createdAt.toISOString()}
            </time>
          </p>
        </div>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{comment.body}</p>
      <div className="mt-4 flex items-center space-x-4">
        <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:text-gray-400 ease-in duration-100"
        >
          <svg
            aria-hidden="true"
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          Reply
        </button>
      </div>
    </article>
  );
}

export default function CommentListing() {
  const router = useRouter();
  const permalink = router.query.permalink as string;

  const { data } = trpc.comment.allComments.useQuery({ permalink });

  return (
    <div>
      {data?.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
}
