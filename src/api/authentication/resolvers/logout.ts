import Context from 'interfaces/Context'
import { UnauthorizedError } from 'type-graphql'
import { Token } from 'generated/type-graphql'

export default async (ctx: Context): Promise<Token> => {
  const refresh = ctx.cookies.get('refresh_token')

  if (!refresh) {
    throw new UnauthorizedError()
  }

  ctx.cookies.set('access_token', '', { maxAge: 0 })
  ctx.cookies.set('refresh_token', '', { maxAge: 0 })
  const token = await ctx.prisma.token
    .delete({
      where: {
        token: refresh,
      },
    })
    .catch(() => {
      throw new UnauthorizedError()
    })

  return token
}
