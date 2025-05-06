export class UserResponseDto{
  id: number
  email: string
  role: string
  phone: string
  address: string

  constructor(id: number, email: string, role: string, phone: string ,address: string) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.phone = phone;
    this.address = address;
  }
}