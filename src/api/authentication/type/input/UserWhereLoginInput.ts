import { Field, InputType } from 'type-graphql'

@InputType({
  isAbstract: true,
  description: undefined,
})
class UserWhereLoginInput {
  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  id?: string | null

  @Field(() => String, {
    nullable: false,
    description: undefined,
  })
  email!: string

  @Field(() => String, {
    nullable: false,
    description: undefined,
  })
  password!: string
}

export default UserWhereLoginInput
