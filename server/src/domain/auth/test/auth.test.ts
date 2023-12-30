import { TokenService } from 'src/domain/token/token.service';
import { AuthService } from '../auth.service';
import { MockContext, createMockContext } from '../../../database/client.mock';
import { UserService } from 'src/domain/user/user.service';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
import { RefreshService } from 'src/domain/token/refreshToken/refresh.service';
import { ConfirmationService } from 'src/domain/email-confirmation/confirmation.service';
import * as mod from 'src/nodemailer/send-email';
import { UserDto } from 'src/domain/user/dto/user.dto';
import { encryptPassword } from 'src/lib/hash-password/encrypt';
import {
  passwordNotCorrect,
  userNotFound,
} from '../constant/authErrorMessages';
let mockCtx: MockContext;
let authService: AuthService;
beforeEach(() => {
  mockCtx = createMockContext();
  const jwtService = new JWTService();
  const refreshService = new RefreshService();
  const userService = new UserService(mockCtx.prisma);
  const tokenService = new TokenService(
    refreshService,
    userService,
    jwtService,
  );
  const confirmationService = new ConfirmationService(mockCtx.prisma);
  authService = new AuthService(tokenService, userService, confirmationService);
});

//create user
test('should create user', async () => {
  const user = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  mockCtx.prisma.user.findUnique.mockResolvedValue(null);
  mockCtx.prisma.user.create.mockResolvedValue(user);
  const mocked = jest
    .spyOn(mod, 'sendEmail')
    .mockImplementation(() => Promise.resolve({}));
  mockCtx.prisma.emailConfirmation.create.mockResolvedValue({
    id: '123',
    code: '',
    user_id: 'asdf',
  });
  const createdUser = await authService.createUser({
    password: '123',
    email: 'myemail@gmail.com',
  });
  expect(mocked).toBeCalledTimes(1);
  expect(createdUser).toEqual(user);
});

test('should not create user', async () => {
  const user = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  mockCtx.prisma.user.findUnique.mockResolvedValue(user);
  await expect(
    authService.createUser({
      password: '123',
      email: 'myemail@gmail.com',
    }),
  ).rejects.toThrow('User already exist');
});

//verify user
test('should verify user', async () => {
  const hash = await encryptPassword('123');
  const user = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash,
    created_at: new Date(),
  };
  mockCtx.prisma.user.findUnique.mockResolvedValue(user);
  const data = await authService.verifyUser({
    email: 'denzeldenisq@gmail.com',
    password: '123',
  });
  expect(data.user).toEqual(UserDto.create(user));
});

test('should not verify user if there is no one', async () => {
  const user = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  mockCtx.prisma.user.findUnique.mockResolvedValue(null);
  await expect(
    authService.verifyUser({
      email: 'denzeldenisq@gmail.com',
      password: '123',
    }),
  ).rejects.toThrow(userNotFound(user.email));
});
test('should not verify user if the hash is not valid', async () => {
  const user = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'wrong_hash',
    created_at: new Date(),
  };
  mockCtx.prisma.user.findUnique.mockResolvedValue(user);
  await expect(
    authService.verifyUser({
      email: 'denzeldenisq@gmail.com',
      password: '123',
    }),
  ).rejects.toThrow(passwordNotCorrect);
});
//verify email
test('should verify email', async () => {
  const unverifiedUser = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  const verifiedUser = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: true,
    hash: 'hash',
    created_at: new Date(),
  };
  const emailConfirmation = {
    id: '1',
    code: 'user_code',
    user_id: '123',
  };
  const correctCode = 'user_code';
  mockCtx.prisma.user.findUnique.mockResolvedValue(unverifiedUser);
  mockCtx.prisma.emailConfirmation.findUnique.mockResolvedValue(
    emailConfirmation,
  );
  mockCtx.prisma.user.update.mockResolvedValue(verifiedUser);
  mockCtx.prisma.emailConfirmation.delete.mockResolvedValue(emailConfirmation);

  const result = await authService.verifyEmail({
    code: correctCode,
    email: unverifiedUser.email,
  });
  const userDto = UserDto.create(verifiedUser);
  expect(result.user).toEqual(userDto);
});

test('should not verify email if there is no user', async () => {
  const unverifiedUser = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  const correctCode = 'user_code';
  mockCtx.prisma.user.findUnique.mockResolvedValue(null);
  await expect(
    authService.verifyEmail({
      code: correctCode,
      email: unverifiedUser.email,
    }),
  ).rejects.toThrow(userNotFound(unverifiedUser.email));
});

test('should not verify email if there is no verification code', async () => {
  const unverifiedUser = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  const correctCode = 'user_code';
  mockCtx.prisma.user.findUnique.mockResolvedValue(unverifiedUser);
  mockCtx.prisma.emailConfirmation.findUnique.mockResolvedValue(null);

  await expect(
    authService.verifyEmail({
      code: correctCode,
      email: unverifiedUser.email,
    }),
  ).rejects.toThrow(userNotFound(unverifiedUser.email));
});

test('should not verify email if verification code is wrong', async () => {
  const unverifiedUser = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  const emailConfirmation = {
    id: '1',
    code: 'user_code',
    user_id: '123',
  };
  const wrongCode = 'wrong_code';
  mockCtx.prisma.user.findUnique.mockResolvedValue(unverifiedUser);
  mockCtx.prisma.emailConfirmation.findUnique.mockResolvedValue(
    emailConfirmation,
  );

  await expect(
    authService.verifyEmail({
      code: wrongCode,
      email: unverifiedUser.email,
    }),
  ).rejects.toThrow('Code is not valid');
});
