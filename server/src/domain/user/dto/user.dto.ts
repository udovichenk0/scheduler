import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const EmailSchema = z.string().email().min(4).max(64);

const CredentialSchema = z.object({
  email: EmailSchema
});

export const UserDtoSchema = z.object({
  id: z.string(),
  email: EmailSchema,
  verified: z.boolean()
});

export const UserSchema = z.object({
  id: z.string(),
  email: EmailSchema,
  verified: z
    .number()
    .transform((v) => !!v)
    .or(z.boolean()),
  created_at: z.date(),
  hash: z.string()
});

export class UserCredentials extends createZodDto(CredentialSchema) {}

export class UserDto extends createZodDto(UserDtoSchema) {}

export class User extends createZodDto(UserSchema) {}
