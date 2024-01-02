import { createZodDto } from 'nestjs-zod';
import { EmailSchema, userDtoSchema } from 'src/domain/user/dto/user.dto';
import { z } from 'zod';
import { CODE_LENGTH } from '../constant/common';

const AuthCredentialSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
});

const AuthDtoSchema = z.object({
  user: userDtoSchema,
  access_token: z.string(),
});

const ResendCodeSchema = z.object({
  email: EmailSchema,
});

const VerifyEmailSchema = z.object({
  code: z.string().min(CODE_LENGTH).max(CODE_LENGTH),
  email: EmailSchema,
});

export class AuthCredentialsDto extends createZodDto(AuthCredentialSchema) {}

export class AuthDto extends createZodDto(AuthDtoSchema) {}

export class ResendCodeDto extends createZodDto(ResendCodeSchema) {}

export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {}
