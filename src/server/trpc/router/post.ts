import { initTRPC, TRPCError } from "@trpc/server";
import { boolean, z } from "zod";
import sanitizeHtml from "sanitize-html";

import {
  createPostSchema,
  getSinglePostSchema,
} from "../../schema/post.schema";
import crypto from "crypto";

const getPermaLink = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, body } = input;

      const permalink = `${getPermaLink(title)}-${crypto
        .randomBytes(2)
        .toString("hex")}`;

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
          permalink,
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
      const { permalink } = input;

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: permalink,
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
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });
    }),
});
