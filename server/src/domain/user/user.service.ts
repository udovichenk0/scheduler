import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { encryptPassword } from 'src/services/session/encrypt-password';
import { job } from 'cron';
import { UserRepository } from './infrastructure/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async findById(id: string) {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async createOne(data: { password: string; email: string }) {
    const hash = await encryptPassword(data.password);
    return await this.userRepository.create({
      email: data.email,
      hash,
    });
  }

  async deleteById(id: string) {
    await this.userRepository.deleteById(id);
  }

  async verify(id: string) {
    return await this.userRepository.verifyById(id);
  }

  async findVerifiedUserByEmail(email: string) {
    const user = await this.findByEmail(email);
    if (user && user.verified) {
      return UserDto.create(user);
    }
    if (user && !user.verified) {
      await this.deleteById(email);
    }
    return {
      error: 'not_found',
      message: 'User is not created',
    };
  }

  static userCollector(){
    const prismaClient = new PrismaClient();
    job(
      '0 */24 * * *',
      async function () {
        await prismaClient.user.deleteMany({
          where: {
            AND: [
              { verified: false },
              {
                created_at: {
                  lte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                },
              },
            ],
          },
        });
      },
      null,
      true,
    );
  }
}
