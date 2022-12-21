import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentRouter = router({
  allComments: publicProcedure
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
              id: permalink,
            },
          },
          include: {
            user: true,
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
    .mutation(async ({ ctx, input }) => {
      const { body, permalink, parentId } = input;

      const user = ctx.session?.user;

      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            body, // Corpo do comentário
            Post: {
              // Conectar o post com o permalink do user
              connect: {
                id: permalink,
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
  countComments: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.comment.count();
    return count;
  }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        permalink: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const deleteComment = await ctx.prisma.comment.deleteMany({
        where: { user, id: input.permalink },
      });
      return deleteComment;
    }),
});
