import { loadPackageDefinition, ServerCredentials, Server, UntypedServiceImplementation } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import { AuthServiceHandlers } from '../../../grpc/auth/AuthService'
import { ProtoGrpcType } from '../../../grpc/auth'
import { refresh } from 'protobuf/auth-service/resolvers'

const definition = loadSync('src/protobuf/auth-service/auth.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const pkg = (loadPackageDefinition(definition) as unknown) as ProtoGrpcType

const handler: AuthServiceHandlers = {
  async refresh(call, callback) {
    await refresh(call, callback)
  },
}

const server = new Server()
server.addService(pkg.auth.AuthService.service, (handler as unknown) as UntypedServiceImplementation)
server.bindAsync(process.env.GRPC_HOST + ':' + process.env.GRPC_PORT, ServerCredentials.createInsecure(), () =>
  server.start()
)

export default server
