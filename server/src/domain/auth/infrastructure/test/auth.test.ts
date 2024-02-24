import { TokenService } from 'src/domain/token/token.service';
import { UserService } from 'src/domain/user/user.service';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
import { RefreshService } from 'src/domain/token/refreshToken/refresh.service';
import { OTPService } from 'src/domain/otp/otp.service';
import { UserDto } from 'src/domain/user/dto/user.dto';
import { encryptPassword } from 'src/services/session/encrypt-password';

import {
  Errors,
  handleError,
} from 'src/services/err/errors';

import { MockContext, createMockContext } from 'src/services/clients/prisma';
import { UserRepository } from 'src/domain/user/infrastructure/repository/user.repository';
import { OTPRepository } from 'src/domain/otp/infrastructure/repository/otp.repository';
import { AuthService } from '../../auth.service';

let mockCtx: MockContext;
let authService: AuthService;
let emailConfirmationService: OTPService;
beforeEach(() => {
  mockCtx = createMockContext();
  const jwtService = new JWTService();
  const refreshService = new RefreshService();
  const userRepository = new UserRepository(mockCtx.prisma)
  const userService = new UserService(userRepository);
  const tokenService = new TokenService(
    refreshService,
    userService,
    jwtService,
  );
  const otpRepository = new OTPRepository(mockCtx.prisma)
  emailConfirmationService = new OTPService(userService, otpRepository);
  authService = new AuthService(
    tokenService,
    userService,
    emailConfirmationService,
  );
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
    .spyOn(emailConfirmationService, 'sendEmail')
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
  const error = await authService.createUser({
    password: '123',
    email: 'myemail@gmail.com',
  })
  expect(error).toStrictEqual(Errors.EmailIsTaken('myemail@gmail.com'));
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
  //@ts-ignore
  expect(data.user).toEqual(UserDto.create(user));
});

test('should not verify user if there is no one', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(null);
    const error = await authService.verifyUser({
      email: 'denzeldenisq@gmail.com',
      password: '123',
    })
  expect(error).toStrictEqual(Errors.UserNotFound('denzeldenisq@gmail.com'))
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
  const error = await authService.verifyUser({
    email: 'denzeldenisq@gmail.com',
    password: '123',
  })
  expect(error).toStrictEqual(
    Errors.GeneralInvalid('Password', '123')
  )
});
