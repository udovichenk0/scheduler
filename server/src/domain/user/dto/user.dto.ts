import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const EmailSchema = z.string().email().min(4);

const userCredentialsSchema = z.object({
  email: EmailSchema,
});

export const userDtoSchema = z.object({
  id: z.string(),
  email: EmailSchema,
  verified: z.boolean(),
});

export class UserCredentials extends createZodDto(userCredentialsSchema) {}

export class UserDto extends createZodDto(userDtoSchema) {}
