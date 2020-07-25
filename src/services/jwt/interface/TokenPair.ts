import { User } from 'generated/type-graphql'
import JWT from 'services/jwt/JWT'

export default interface TokenType {
  user: User
  access_token: JWT
  refresh_token: JWT
}
