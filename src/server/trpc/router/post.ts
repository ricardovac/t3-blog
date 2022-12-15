import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createPostSchema,
  getSinglePostSchema,
} from "../../schema/post.schema";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return post;
    }),
  allPost: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  singlePost: publicProcedure
    .input(getSinglePostSchema)
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });
    }),
});
