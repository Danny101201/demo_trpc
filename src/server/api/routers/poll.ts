import { object, z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  getPoll: publicProcedure
    .input(z.object({ pollId: z.string() }))
    .query(async ({ input, ctx }) => {
      const poll = await ctx.prisma.poll.findUnique({
        where: {
          id: input.pollId
        },
        include: {
          answers: true
        }
      })
      return poll;
    }),
  submitResponse: publicProcedure
    .input(z.object({
      answer_id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.response.create({
        data: {
          answer_id: input.answer_id
        }
      })
      return response
    })


});
