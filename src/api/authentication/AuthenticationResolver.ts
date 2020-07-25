import { Mutation, Args, Ctx, Resolver, Query, UnauthorizedError } from 'type-graphql'
import { Token } from 'generated/type-graphql'
import { login, logout } from 'api/authentication/resolvers'
import Context from 'interfaces/Context'
import AccessTokens from 'api/authentication/type/AccessTokens'
import UserLoginArgs from 'api/authentication/type/args/UserLoginArgs'

@Resolver(() => AccessTokens)
export default class AuthenticationResolver {
  @Mutation(() => AccessTokens)
  public async login(@Ctx() ctx: Context, @Args() args: UserLoginArgs): Promise<AccessTokens | UnauthorizedError> {
    return login(ctx, args)
  }

  @Mutation(() => Token)
  public async logout(@Ctx() ctx: Context): Promise<Token | UnauthorizedError> {
    return logout(ctx)
  }

  @Query(() => AccessTokens)
  public test(@Ctx() ctx: Context, @Args() args: UserLoginArgs): AccessTokens {
    throw Error('function not implemented')
  }
}
