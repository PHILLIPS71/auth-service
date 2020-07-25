import { User } from '../../../../grpc/user/User'
import { UserWhereUniqueInput } from '../../../../grpc/user/UserWhereUniqueInput'
import { Metadata } from '@grpc/grpc-js'
import { NotFoundError } from 'error'
import UserService from 'protobuf/user-service/client'

export default async (args: UserWhereUniqueInput): Promise<User | NotFoundError> => {
  const promise = new Promise<User>((resolve, reject) => {
    UserService.findOne(args, new Metadata(), (err, data) => {
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  })

  return promise.catch(() => new NotFoundError())
}
