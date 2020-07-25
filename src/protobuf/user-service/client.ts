import { loadSync } from '@grpc/proto-loader'
import { ProtoGrpcType } from '../../../grpc/user'
import { credentials, loadPackageDefinition } from '@grpc/grpc-js'

const definition = loadSync('src/protobuf/user-service/user.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const pkg = (loadPackageDefinition(definition) as unknown) as ProtoGrpcType
const client = new pkg.user.UserService(
  process.env.USER_SERVICE_HOST + ':' + process.env.USER_SERVICE_PORT,
  credentials.createInsecure()
)

// client.update({ email: 'jordypee27@gmail.com', first_name: 'PHIL' }, new grpc.Metadata(), (err, data) => {
//   console.log(data);
// });

export default client
