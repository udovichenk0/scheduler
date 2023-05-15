import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// const userSchema = z.object({

// })

const userCredentialsSchema = z.object({
  email: z.string().email().min(4),
});

export class UserCredentials extends createZodDto(userCredentialsSchema) {}
