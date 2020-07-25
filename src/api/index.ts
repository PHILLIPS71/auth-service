import { buildSchema } from 'type-graphql'
import AuthenticationResolver from 'api/authentication/AuthenticationResolver'
import TokenCrudResolver from 'api/token/TokenCrudResolver'
import { TokenRelationsResolver } from 'generated/type-graphql'

export default async () => {
  return buildSchema({
    resolvers: [AuthenticationResolver, TokenCrudResolver, TokenRelationsResolver],
    validate: false,
    emitSchemaFile: true,
  })
}
