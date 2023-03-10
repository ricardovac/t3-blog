import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../server/schema/post.schema";
import { trpc } from "../../utils/trpc";
import toast, { Toaster } from "react-hot-toast";

function createPostPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();

  const { mutate, error } = trpc.post.createPost.useMutation({
    onSuccess({ id }) {
      // router.push(`/posts/${id}`);
      router.push("/");
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <div className="flex min-h-screen bg-zinc-900 font-space">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full flex-col items-center justify-center text-white"
      >
        <h1>Create your post</h1>
        <br />
        {error && (
          <p id="hideMe" className="text-red-700">
            Body must be at least 10 characters
          </p>
        )}
        <input
          type="text"
          placeholder="Your post title"
          {...register("title")}
          className="m-2 w-2/4 scale-100 overflow-hidden rounded-md border-2 border-zinc-500 bg-transparent p-4 shadow outline-none duration-500 ease-in hover:shadow-md focus:shadow-zinc-700"
        />
        <textarea
          placeholder="Write..."
          {...register("body")}
          className="m-2 w-2/4 scale-100 overflow-hidden rounded-md border-2 border-zinc-500 bg-transparent p-4 outline-none"
        />
        <br />
        <div className="flex w-2/4 justify-between">
          <div>
            <button className="hover rounded border p-2 text-white hover:bg-zinc-800">
              Create post
            </button>
          </div>
          <div>
            <Link href="/">
              <button className="hover rounded border p-2 text-white hover:bg-zinc-800">
                Back
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default createPostPage;
