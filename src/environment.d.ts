declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      HOST: string
      PORT: number
      DATABASE_URL: string
      GRPC_HOST: string
      GRPC_PORT: string
      USER_SERVICE_HOST: string
      USER_SERVICE_PORT: number
    }
  }
}

export {}
