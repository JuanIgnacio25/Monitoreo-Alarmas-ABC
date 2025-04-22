import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepository{
  constructor(private prismaService: PrismaService){}

  async findAll(){
    return await this.prismaService.user.findMany();
  }

  async create(user: any){
    console.log(user);
    const createdUser = await this.prismaService.user.create({
      data:user
    })

    return createdUser;
  }
}