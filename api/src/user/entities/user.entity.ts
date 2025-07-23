import { UserInterface } from "../interfaces/user.interface"

export class User {
  id: number
  email: string
  password: string
  role: string
  phone: string
  address: string
  createdAt: Date
  updatedAt: Date

  constructor(userData: UserInterface){
    this.id = userData.id,
    this.email = userData.email,
    this.password = userData.password,
    this.role = userData.role,
    this.phone = userData.phone,
    this.address = userData.address,
    this.createdAt = userData.createdAt,
    this.updatedAt = userData.updatedAt
  }
}
