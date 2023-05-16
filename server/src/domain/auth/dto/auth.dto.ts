import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const authCredentials = z.object({
  email: z.string().email().min(4),
  password: z.string().min(8),
});

export class AuthCredentialsDto extends createZodDto(authCredentials) {}
