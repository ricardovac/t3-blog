import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const defaultValues = {
  body: "",
};

export default function CommentForm({ parentId }: { parentId?: string }) {
  const router = useRouter();
  const permalink = router.query.permalink as string;
  const { handleSubmit, register } = useForm({
    defaultValues,
  });

  const { mutate, isLoading } = trpc.comment.addComments.useMutation();

  const onSubmit = (data: { body: string }) => {
    const payload = {
      ...data,
      permalink,
      parentId,
    };

    mutate(payload);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-end">
        <h2 className="text-xl font-bold text-white dark:text-white">
          Discussion (20)
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
            rows={6}
            className="w-full border-0 bg-transparent px-0 text-sm text-white focus:outline-none focus:ring-0"
            placeholder="Write a comment..."
            required
            {...register("body")}
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-primary-700 hover:bg-primary-800 flex rounded-lg border py-2.5 px-4 text-center text-xs text-white hover:bg-zinc-700 focus-within:hover:bg-zinc-800"
          >
            {parentId ? "Post reply" : "Post comment"}
          </button>
          <Link href="/">
            <button className="hover rounded border py-2.5 px-4 text-xs text-white hover:bg-zinc-800">
              Back
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
