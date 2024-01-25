import { createZodDto } from 'nestjs-zod';
import { CODE_LENGTH } from 'src/domain/otp/constants/common';
import { EmailSchema, UserDtoSchema } from 'src/domain/user/dto/user.dto';
import { z } from 'zod';

const AuthCredentialSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
});

const AuthDtoSchema = z.object({
  user: UserDtoSchema,
  access_token: z.string(),
});

const VerifyEmailSchema = z.object({
  code: z.string().min(CODE_LENGTH).max(CODE_LENGTH),
  email: EmailSchema,
});

export class AuthCredentialsDto extends createZodDto(AuthCredentialSchema) {}

export class AuthDto extends createZodDto(AuthDtoSchema) {}

export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {}
