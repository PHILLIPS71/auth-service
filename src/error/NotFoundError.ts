import { ApolloError } from 'apollo-server-koa'

export default class NotFoundError extends ApolloError {
  constructor() {
    super('cannot find the data you are looking for', 'NOT_FOUND')
  }
}
