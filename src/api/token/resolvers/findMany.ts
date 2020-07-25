import Context from 'interfaces/Context'
import { Token, FindManyTokenArgs } from 'generated/type-graphql'
import { getUserId } from 'services/jwt'

export default async (ctx: Context, args: FindManyTokenArgs): Promise<Token[]> => {
  const user_id = await getUserId(ctx)

  if (user_id instanceof Error) {
    throw user_id
  }

  return ctx.prisma.token.findMany(args)
}
