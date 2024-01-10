import { createZodDto } from 'nestjs-zod';
import { EmailSchema } from 'src/domain/user/dto/user.dto';
import { z } from 'zod';
import { CODE_LENGTH } from '../constants/common';

const ResendCodeSchema = z.object({
  email: EmailSchema,
});

const VerifyEmailSchema = z.object({
  code: z.string().min(CODE_LENGTH).max(CODE_LENGTH),
  email: EmailSchema,
});

export class ResendCodeDto extends createZodDto(ResendCodeSchema) {}

export class VerifyOTPDto extends createZodDto(VerifyEmailSchema) {}
