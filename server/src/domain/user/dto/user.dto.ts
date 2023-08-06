import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const userCredentialsSchema = z.object({
  email: z.string().email().min(4),
});

export const userDtoSchema = z.object({
  id: z.string(),
  email: z.string().email().min(4),
  verified: z.boolean(),
});

export class UserCredentials extends createZodDto(userCredentialsSchema) {}

export class UserDto extends createZodDto(userDtoSchema) {}
