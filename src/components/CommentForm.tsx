import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { comment } from "postcss";

const defaultValues = {
  body: "",
};

export default function CommentForm({ parentId }: { parentId?: string }) {
  const router = useRouter();
  const postId = router.query.postId as string;
  const { handleSubmit, register, reset } = useForm({
    defaultValues,
  });

  const utils = trpc.useContext();

  const commentsLength = trpc.comment.countComments.useQuery().data;
  const { mutate } = trpc.comment.addComments.useMutation({
    onSuccess: () => {
      reset();

      utils.comment.allComments.invalidate({ postId });
      utils.comment.countComments.invalidate();
    },
  });

  const onSubmit = (data: { body: string }) => {
    const payload = {
      ...data,
      postId,
      parentId,
    };

    mutate(payload);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-end">
        <h2 className="text-xl font-bold text-white dark:text-white">
          Discussion ({commentsLength})
        </h2>
      </div>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-zinc-800 py-2 px-4 focus-within:bg-opacity-50 dark:border-gray-700 dark:bg-gray-800">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            defaultValue={defaultValues.body}
            id="comment"
            rows={4}
            className="w-full border-0 bg-transparent px-0 text-sm text-white focus:outline-none focus:ring-0"
            placeholder="Write a comment..."
            required
            {...register("body")}
          ></textarea>
        </div>
        <div className="flex justify-between">
          <Link href="/">
            <button className="hover rounded border py-2.5 px-4 text-xs text-white duration-150 ease-in-out hover:bg-zinc-800">
              Back
            </button>
          </Link>
          <button
            type="submit"
            className="bg-primary-700 hover:bg-primary-800 flex rounded-lg border py-2.5 px-4 text-center text-xs text-white duration-150 ease-in-out hover:bg-zinc-700 focus-within:hover:bg-zinc-800"
          >
            {parentId ? "Post reply" : "Post comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
