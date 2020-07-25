import { loadPackageDefinition, ServerCredentials, Server, UntypedServiceImplementation } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import { AuthServiceHandlers } from '../../../grpc/auth/AuthService'
import { ProtoGrpcType } from '../../../grpc/auth'
import { UAParser } from 'ua-parser-js'
import * as JWT from 'services/jwt'
import UserService from 'protobuf/user-service'
import application from 'main'

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
    // try find the refresh token in the db if not found error out
    let token = await application.prisma.token.findOne({
      where: {
        token: call.request?.refresh_token,
      },
    })

    if (!token) {
      return callback({ code: 404 }, null)
    }

    // need to have a user to create a refresh token against
    const user = await UserService.findOne({ id: token?.user_id })
    if (user instanceof Error) {
      return callback({ code: 404 }, null)
    }

    // update the db with the new token along with the user-agent who requested it
    const refresh = JWT.refresh(user)
    const agent = new UAParser().setUA(call.metadata.getMap()['user-agent'] as string).getResult()
    token = await application.prisma.token.update({
      where: {
        token: token.token,
      },
      data: {
        token: refresh.getToken(),
        user_agent: {
          update: {
            raw: agent.ua,
            platform: agent.os.name,
            platform_version: agent.os.version,
            browser: agent.browser.name,
            browser_version: agent.browser.version,
          },
        },
      },
    })

    callback(null, {
      access_token: JWT.access(user).getToken(),
      refresh_token: refresh.getToken(),
    })
  },
}

const server = new Server()
server.addService(pkg.auth.AuthService.service, (handler as unknown) as UntypedServiceImplementation)
server.bindAsync(process.env.GRPC_HOST + ':' + process.env.GRPC_PORT, ServerCredentials.createInsecure(), () =>
  server.start()
)

export default server
