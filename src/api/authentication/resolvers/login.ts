import { TokenType } from 'generated/type-graphql'
import { UAParser } from 'ua-parser-js'
import { UnauthorizedError } from 'type-graphql'
import AccessTokens from 'api/authentication/type/AccessTokens'
import UserLoginArgs from '../type/args/UserLoginArgs'
import Context from 'interfaces/Context'
import UserService from 'protobuf/user-service'
import * as JWT from 'services/jwt'

export default async (ctx: Context, args: UserLoginArgs): Promise<AccessTokens | UnauthorizedError> => {
  const user = await UserService.findOne({ email: args.where.email })

  if (user instanceof Error || !user.id) {
    throw new UnauthorizedError()
  }

  const agent = new UAParser().setUA(ctx.request.header['user-agent']).getResult()
  const access = JWT.access(user)
  const refresh = JWT.refresh(user)

  await ctx.prisma.token.create({
    data: {
      token: refresh.getToken(),
      type: TokenType.REFRESH_TOKEN,
      user_id: user.id,
      user_agent: {
        create: {
          ip: ctx.ip,
          raw: agent.ua,
          platform: agent.os.name,
          platform_version: agent.os.version,
          browser: agent.browser.name,
          browser_version: agent.browser.version,
        },
      },
    },
  })

  ctx.cookies.set('access_token', access.getToken(), { expires: access.getExpiryDate() })
  ctx.cookies.set('refresh_token', refresh.getToken(), { expires: refresh.getExpiryDate() })
  return {
    access_token: access.getToken(),
    refresh_token: refresh.getToken(),
  }
}
