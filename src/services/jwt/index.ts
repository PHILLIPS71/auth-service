import { User } from '../../../grpc/user/User'
import { UnauthorizedError } from 'type-graphql'
import { NotFoundError } from 'error'
import * as jsonwebtoken from 'jsonwebtoken'
import UserService from 'protobuf/user-service'
import Context from 'interfaces/Context'
import JWT from 'services/jwt/JWT'
import Payload from 'services/jwt/interface/Payload'
import TokenType from 'services/jwt/TokenType'
import fs from 'fs'

const PRIVATE_KEY = fs.readFileSync('jwt-private.key', 'utf-8')
const PUBLIC_KEY = fs.readFileSync('jwt-public.key', 'utf-8')
const ISSUER = 'auth-service'

/**
 * Sign the given payload into a JSON Web Token object where
 * options are already predefined
 *
 * @param payload payload to sign, could be an literal, buffer or string
 */
export const access = (user: User): JWT => {
  return new JWT(TokenType.ACCESS, { user_id: user.id }, PRIVATE_KEY, {
    algorithm: TokenType.ACCESS.getAlgorithm(),
    expiresIn: TokenType.ACCESS.getDuration(),
    issuer: ISSUER,
    subject: user.email,
  })
}

/**
 * Sign the given payload into a JSON Web Token object where
 * options are already predefined
 *
 * @param payload payload to sign, could be an literal, buffer or string
 */
export const refresh = (user: User): JWT => {
  return new JWT(TokenType.REFRESH, { user_id: user.id }, PRIVATE_KEY, {
    algorithm: TokenType.REFRESH.getAlgorithm(),
    expiresIn: TokenType.REFRESH.getDuration(),
    issuer: ISSUER,
    subject: user.email,
  })
}

/**
 * Synchronously verify and decode given token to already provided public key
 *
 * @param token jwt string to verify
 */
export const verify = (token: string, type: TokenType): Payload => {
  return jsonwebtoken.verify(token, PUBLIC_KEY, { algorithms: [type.getAlgorithm()] }) as Payload
}

/**
 * Stores a token within a cookie that gets sent back to
 * the client via the provided context
 *
 * @param token then that has been generated
 * @param context the context in where to store the cookie
 */
export const store = (token: JWT, context: Context): void => {
  context.cookies.set(token.getType().toString(), token.getToken(), {
    expires: token.getExpiryDate(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
}

/**
 * Finds a user_id based upon the refresh_token in the
 * cookie found in the provided context
 *
 * @param ctx request context with refresh cookie
 */
export const getUserId = async (ctx: Context): Promise<string | (UnauthorizedError | NotFoundError)> => {
  const refresh = ctx.cookies.get('refresh_token')

  if (!refresh) {
    return new UnauthorizedError()
  }

  const token = await ctx.prisma.token.findOne({
    where: {
      token: refresh,
    },
  })

  if (!token?.user_id) {
    return new NotFoundError()
  }

  return token.user_id
}

/**
 * Finds a User based upon the refresh_token in the
 * cookie found in the provided context
 *
 * @param ctx request context with refresh cookie
 */
export const getUser = async (ctx: Context): Promise<User | (UnauthorizedError | NotFoundError)> => {
  const user_id = await getUserId(ctx).catch((err) => err)
  return UserService.findOne({ id: user_id })
}
