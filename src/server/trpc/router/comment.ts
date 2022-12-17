import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const commentRouter = router({
  allComments: protectedProcedure
    .input(
      z.object({
        permalink: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { permalink } = input;

      try {
        const comments = await ctx.prisma.comment.findMany({
          where: {
            Post: {
              permalink,
            },
          },
        });

        return comments;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
  addComments: protectedProcedure
    .input(
      z.object({
        body: z.string(),
        permalink: z.string(),
        parentId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { body, permalink, parentId } = input;

      const user = ctx.session?.user;

      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            body, // Corpo do comentário
            Post: { // Conectar o post com o permalink do user
              connect: {
                permalink,
              },
            },
            user: {
              connect: {
                id: user?.id,
              },
            },
            ...(parentId && {
              parent: {
                connect: {
                  id: parentId,
                },
              },
            }),
          },
        });

        return comment;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
