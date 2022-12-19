import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

const defaultValues = {
  body: "",
};

export default function ReplyForm({
  parentId,
  setReplying,
}: {
  parentId?: string;
  setReplying: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const permalink = router.query.permalink as string;
  const { handleSubmit, register, reset } = useForm({
    defaultValues,
  });

  const utils = trpc.useContext();

  const { mutate, isLoading } = trpc.comment.addComments.useMutation({
    onSuccess: () => {
      reset();

      utils.comment.allComments.invalidate({ permalink });
    },
  });

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
      <form className="m-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-zinc-800 py-2 px-4 focus-within:bg-opacity-50">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            defaultValue={defaultValues.body}
            id="comment"
            rows={2}
            className="w-full border-0 bg-transparent px-0 text-sm text-white focus:outline-none focus:ring-0"
            placeholder="Write your reply..."
            required
            {...register("body")}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary-700 hover:bg-primary-800 flex rounded-lg border py-2.5 px-4 text-center text-xs text-white hover:bg-zinc-700 focus-within:hover:bg-zinc-800"
            onClick={() => {
              setTimeout(() => {
                setReplying(false);
              }, 100);
            }}
          >
            {parentId ? "Post reply" : "Post comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
