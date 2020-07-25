import { ObjectType, Field } from 'type-graphql'

@ObjectType()
class AccessTokens {
  @Field((_type) => String)
  access_token!: String

  @Field((_type) => String)
  refresh_token!: String
}

export default AccessTokens
