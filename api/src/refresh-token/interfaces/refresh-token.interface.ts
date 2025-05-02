
export interface RefreshTokenInterface {
  id: number
  token: string   
  userId: number
  expiresAt: Date
  createdAt: Date
}