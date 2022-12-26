import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { Upvote } from '@prisma/client'

import {
  createPostSchema,
  getSinglePostSchema,
} from "../../schema/post.schema";
// import crypto from "crypto";
//
// const getPermaLink = (title: string) =>
//   title
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/[\s_-]+/g, "-")
//     .replace(/^-+|-+$/g, "");

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, body } = input;
      //
      // const postId = `${getPermaLink(title)}-${crypto
      //   .randomBytes(2)
      //   .toString("hex")}`;
      //
      const user = ctx.session?.user;

      return ctx.prisma.post.create({
        data: {
          title,
          body: sanitizeHtml(body, {
            allowedTags: ["b", "i", "em", "strong", "a"],
            allowedAttributes: {
              a: ["href"],
            },
            allowedIframeHostnames: ["www.youtube.com"],
          }),
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
    }),
  allPost: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }),
  findByPermalink: publicProcedure
    .input(
      z.object({
        permalink: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.permalink,
        },
        select: {
          title: true,
          body: true,
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return post;
    }),
  singlePost: publicProcedure
    .input(getSinglePostSchema)
    .query(async ({ input, ctx: { prisma, session } }) => {
      const items = await prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          _count: { select: { Upvote: true } }
        },
        // select: {
        //   title: true,
        //   body: true,
        //   id: true,
        //   createdAt: true,
        //   user: {
        //     select: {
        //       name: true
        //     }
        //   }
        // }
      });

      let upvotes: Upvote[] = []
      if (session?.user?.id) {
        [upvotes] = await Promise.all([
          prisma.upvote.findMany({
            where: {
              userId: session.user.id,
              postId: input.postId
            }
          })
        ])
      }

      return {
        ...items,
        likedByMe: upvotes.some((vote) => vote.postId === input.postId)
      }
    }),
  upVote: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        isLiked: z.boolean()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const userId = session?.user.id;

      if (input.isLiked) {
        await prisma.upvote.create({
          data: {
            postId: input.postId,
            userId,
          }
        })
      } else {
        await prisma.upvote.delete({
          where: {
            postId_userId: {
              postId: input.postId,
              userId
            }
          }
        })
      }

      return {
        message: "OK"
      }
    }),
  countVotes: publicProcedure
    .input(
      z.object({
        postId: z.string()
      }))
    .query(async ({ ctx: { prisma }, input }) => {
      const count = await prisma.upvote.count({
        where: {
          postId: input.postId,
        }
      });
      return {
        count,
      }
    })
});
