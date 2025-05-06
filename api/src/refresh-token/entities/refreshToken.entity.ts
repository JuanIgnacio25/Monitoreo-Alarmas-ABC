import { RefreshTokenInterface } from "../interfaces/refresh-token.interface"

export class RefreshToken {
  id: number
  token: string   
  userId: number
  expiresAt: Date
  createdAt: Date

  constructor(refreshTokenData: RefreshTokenInterface){
    this.id = refreshTokenData.id,
    this.token = refreshTokenData.token,
    this.userId = refreshTokenData.userId,
    this.expiresAt = refreshTokenData.expiresAt,
    this.createdAt = refreshTokenData.createdAt
  }
}