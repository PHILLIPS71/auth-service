import jsonwebtoken, { Secret, SignOptions } from 'jsonwebtoken'
import TokenType from 'services/jwt/TokenType'
import ms from 'ms'

export default class JWT {
  private readonly type: TokenType
  private readonly token: string
  private readonly options: SignOptions

  constructor(type: TokenType, payload: string | Buffer | object, secretOrPrivateKey: Secret, options: SignOptions) {
    this.type = type
    this.options = options
    this.token = jsonwebtoken.sign(payload, secretOrPrivateKey, options)
  }

  public getType(): TokenType {
    return this.type
  }

  public getToken(): string {
    return this.token
  }

  public getOptions(): SignOptions {
    return this.options
  }

  public getExpiryDate(): Date {
    return new Date(Date.now() + ms(this.options.expiresIn as string))
  }
}
