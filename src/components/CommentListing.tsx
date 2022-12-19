import { useState } from "react";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { CommentWithChildren, trpc } from "../utils/trpc";
import ReplyForm from "./ReplyForm";
import TimeAgo from "timeago-react";

function getReplyCountText(count: number) {
  if (count === 0) {
    return "No Replies";
  }

  if (count === 1) {
    return "1 reply";
  }

  return `${count} replies`;
}

export function CommentActions({
  commentId,
  replyCount,
}: {
  commentId: string;
  replyCount: number;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between space-x-4 p-4">
        <div className="flex space-x-4">
          <span>{getReplyCountText(replyCount)}</span>
          <button
            type="button"
            className="flex items-center text-sm text-gray-500 duration-100 ease-in hover:text-gray-400"
            onClick={() => setReplying(!replying)}
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            Reply
          </button>
        </div>
        <div>
          {replying && (
            <IoMdClose
              className="h-5 w-5 cursor-pointer hover:scale-110"
              onClick={() => setReplying(!replying)}
            >
              Close
            </IoMdClose>
          )}
        </div>
      </div>

      {replying && <ReplyForm parentId={commentId} setReplying={setReplying} />}
    </div>
  );
}

function Comment({ comment }: { comment: CommentWithChildren }) {
  const utils = trpc.useContext();

  const img = comment.user.image as string | undefined;
  const deleteComment = trpc.comment.deleteComment.useMutation({
    onSuccess: () => {
      utils.comment.invalidate();
    },
  });

  return (
    <div className="mb-4 rounded-lg">
      <article className="group bg-transparent px-4 pt-4 text-base">
        <footer className="mb-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <p className="mr-3 inline-flex items-center text-sm text-white">
                <img
                  className="mr-2 h-6 w-6 rounded-full"
                  src={img}
                  alt="Profile picture"
                />
                {comment.user.name}
              </p>
              <p className="text-sm text-gray-600 ">
                <time title="February 8th, 2022">
                  <TimeAgo
                    datetime={comment.createdAt.toISOString()}
                    locale="pt-br"
                  />
                </time>
              </p>
            </div>
            <div className="cursor-pointer opacity-0 duration-200 ease-in-out group-hover:opacity-100">
              <IoMdTrash
                size={20}
                onClick={() => {
                  deleteComment.mutate({
                    permalink: comment.id,
                  });
                }}
              />
            </div>
          </div>
        </footer>
        <p className="text-gray-500 dark:text-gray-400">{comment.body}</p>
      </article>

      <CommentActions
        commentId={comment.id}
        replyCount={comment.children.length}
      />

      {comment.children && comment.children.length > 0 && (
        <div>
          <CommentListing comments={comment.children} />
        </div>
      )}
    </div>
  );
}

// TODO: Create a new component to handle the commentwithChildren.
export default function CommentListing({
  comments,
}: {
  comments: Array<CommentWithChildren>;
}) {
  return (
    <>
      {comments?.map((comment) => {
        return (
          <div className="ml-6">
            <Comment key={comment.id} comment={comment} />
          </div>
        );
      })}
    </>
  );
}
