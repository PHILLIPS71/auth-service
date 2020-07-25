import { PrismaClient } from '@prisma/client'
import { Context } from 'koa'

interface IContext extends Context {
  prisma: PrismaClient
}

export default IContext
