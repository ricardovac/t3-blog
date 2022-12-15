import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../server/schema/post.schema";
import { trpc } from "../../utils/trpc";

function createPostPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();

  const { mutate, error } = trpc.post.createPost.useMutation({
    onSuccess({ id }) {
      router.push(`/posts/${id}`);
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      <h1>Create Posts</h1>
      <br />
      <input type="text" placeholder="Your post title" {...register("title")} />
      <textarea placeholder="Your post title" {...register("body")} />
      <br />
      <button>Create post</button>
    </form>
  );
}

export default createPostPage;
