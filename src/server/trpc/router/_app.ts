import { router } from "../trpc";
import { authRouter } from "./auth";
import { commentRouter } from "./comment";
import { postRouter } from "./post";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
