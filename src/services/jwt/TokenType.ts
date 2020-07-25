import { Algorithm } from 'jsonwebtoken'

class TokenType {
  static readonly ACCESS = new TokenType('access_token', 'RS256', '15m')
  static readonly REFRESH = new TokenType('refresh_token', 'RS256', '30d')

  private constructor(
    private readonly name: string,
    private readonly algorithm: Algorithm,
    private readonly duration: string
  ) {}

  public toString() {
    return this.name
  }

  public getAlgorithm() {
    return this.algorithm
  }

  public getDuration() {
    return this.duration
  }
}

export default TokenType
