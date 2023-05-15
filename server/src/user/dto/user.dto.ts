import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const userCredentialsSchema = z.object({
  email: z.string().email().min(4),
});

const userDto = z.object({
  id: z.number(),
  email: z.string().email().min(4),
  verified: z.boolean(),
});

export class UserCredentials extends createZodDto(userCredentialsSchema) {}

export class UserDto extends createZodDto(userDto) {}
