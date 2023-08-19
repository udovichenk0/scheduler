import { createZodDto } from 'nestjs-zod';
import { userDtoSchema } from 'src/domain/user/dto/user.dto';
import { z } from 'zod';
const authCredentialSchema = z.object({
  email: z.string().email().min(4),
  password: z.string().min(8),
});

const authDtoSchema = z.object({
  user: userDtoSchema,
  access_token: z.string(),
});

export class AuthCredentialsDto extends createZodDto(authCredentialSchema) {}

export class AuthDto extends createZodDto(authDtoSchema) {}
