import { EmailSchema, UserDto } from "./dto/user.dto";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { encryptPassword } from "src/services/session/encrypt-password";
import { job } from "cron";
import { UserRepository } from "./infrastructure/repository/user.repository";
import { Errors, isError } from "src/services/err/errors";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async findById(id: string) {
    try {
      if (!id) return Errors.Missing("User id");
      const user = await this.userRepository.findById(id);
      if (!user) {
        return Errors.GeneralNotFound("User", id);
      }
      return user;
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  async findByEmail(email: string) {
    try {
      if (!email) return Errors.Missing("Email");
      if (!EmailSchema.safeParse(email).success)
        return Errors.GeneralInvalid("Email", email);
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return Errors.UserNotFound(email);
      }
      return user;
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  async createOne({ hash, email }: { hash: string; email: string }) {
    try {
      if (!email) return Errors.Missing("Email");
      if (!hash) return Errors.Missing("Hash");
      if (!EmailSchema.safeParse(email))
        return Errors.GeneralInvalid("Email", email);
      return await this.userRepository.create({
        email,
        hash
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  async deleteById(id: string) {
    try {
      if (!id) return Errors.Missing("User id");
      return await this.userRepository.deleteById(id);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  async verify(id: string) {
    try {
      if (!id) return Errors.Missing("User id");
      return await this.userRepository.verifyById(id);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  async findVerifiedUserByEmail(email: string) {
    try {
      if (!email) return Errors.Missing("Email");
      if (!EmailSchema.safeParse(email))
        return Errors.GeneralInvalid("Email", email);
      const user = await this.findByEmail(email);
      if (isError(user)) return user;
      if (user.verified) {
        return UserDto.create(user);
      } else {
        await this.deleteById(email);
      }
      return Errors.UserNotFound(email);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  static userCollector() {
    const prismaClient = new PrismaClient();
    job(
      "0 */24 * * *",
      async function () {
        await prismaClient.user.deleteMany({
          where: {
            AND: [
              { verified: false },
              {
                created_at: {
                  lte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                }
              }
            ]
          }
        });
      },
      null,
      true
    );
  }
}
