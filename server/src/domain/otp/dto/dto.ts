import { createZodDto } from 'nestjs-zod';
import { EmailSchema, UserSchema } from 'src/domain/user/dto/user.dto';
import { z } from 'zod';
import { CODE_LENGTH } from '../infrastructure/constants/common';

const ResendCodeSchema = z.object({
  email: EmailSchema,
});

const CodeSchema = z.string().min(CODE_LENGTH).max(CODE_LENGTH)

const VerifyEmailSchema = z.object({
  code: CodeSchema,
  email: EmailSchema,
});

export type Confirmation = z.infer<typeof UserSchema> & {
  code: z.infer<typeof CodeSchema>,
}

export class ResendCodeDto extends createZodDto(ResendCodeSchema) {}

export class VerifyOTPDto extends createZodDto(VerifyEmailSchema) {}
