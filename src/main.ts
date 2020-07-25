import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-koa'
import Koa, { Context } from 'koa'
import schema from 'api'
import _ from 'lodash'
import 'protobuf/auth-service'
import 'protobuf/user-service'

class Application {
  private readonly ip: string
  private readonly port: number
  private readonly koa: Koa
  public readonly prisma: PrismaClient

  constructor(ip: string, port: number) {
    this.ip = ip
    this.port = port

    this.koa = new Koa()

    this.prisma = new PrismaClient()
    this.prisma.connect()
  }

  public async start() {
    const apollo = new ApolloServer({
      schema: await schema(),
      playground: process.env.NODE_ENV == 'development',
      context: ({ ctx }: Context) => _.merge(ctx, { prisma: this.prisma }),
    })

    this.koa.use(apollo.getMiddleware())
    this.koa.listen(this.port, this.ip, () => {
      console.info('Koa server listening on http://%s:%d, in %s mode', this.ip, this.port, process.env.NODE_ENV)
    })
  }
}

const application = new Application(process.env.HOST!, +process.env.PORT!)
application.start().catch(console.log)

export default application
