import { Field, ArgsType } from 'type-graphql'
import UserWhereLoginInput from 'api/authentication/type/input/UserWhereLoginInput'

@ArgsType()
class UserLoginArgs {
  @Field(() => UserWhereLoginInput, { nullable: false })
  where!: UserWhereLoginInput
}

export default UserLoginArgs
