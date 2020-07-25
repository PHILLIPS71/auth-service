import { Args, Ctx, Resolver, Query } from 'type-graphql'
import { Token, FindManyTokenArgs } from 'generated/type-graphql'
import { findMany } from 'api/token/resolvers'
import Context from 'interfaces/Context'

@Resolver(() => Token)
export default class TokenCrudResolver {
  @Query(() => [Token])
  public tokens(@Ctx() ctx: Context, @Args() args: FindManyTokenArgs): Promise<Token[]> {
    return findMany(ctx, args)
  }
}
