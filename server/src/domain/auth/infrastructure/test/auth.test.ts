import { TokenService } from 'src/domain/token/token.service';
import { UserService } from 'src/domain/user/user.service';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
import { RefreshService } from 'src/domain/token/refreshToken/refresh.service';
import { OTPService } from 'src/domain/otp/otp.service';
import { UserDto } from 'src/domain/user/dto/user.dto';
import { encryptPassword } from 'src/services/session/encrypt-password';

import {
  Errors,
} from 'src/services/err/errors';

import { createMockContext } from 'src/services/clients/prisma';
import { UserRepository } from 'src/domain/user/infrastructure/repository/user.repository';
import { OTPRepository } from 'src/domain/otp/infrastructure/repository/otp.repository';
import { AuthService } from '../../auth.service';
import { EmailTransporter } from 'src/services/nodemailer/client';

let authService: AuthService;
let userService: UserService
let emailConfirmationService: OTPService;
let tokenService: TokenService
beforeEach(() => {
  const mockCtx = createMockContext();
  const jwtService = new JWTService();
  const refreshService = new RefreshService();
  const userRepository = new UserRepository(mockCtx.prisma)
  const otpRepository = new OTPRepository(mockCtx.prisma)
  userService = new UserService(userRepository);
  tokenService = new TokenService(
    refreshService,
    userService,
    jwtService,
  );
  emailConfirmationService = new OTPService(userService, otpRepository, new EmailTransporter());
  
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
  jest.spyOn(userService, 'findByEmail').mockResolvedValue(Errors.UserNotFound(user.email))
  jest.spyOn(userService, 'createOne').mockResolvedValue(user)
  jest.spyOn(emailConfirmationService, 'sendEmail')
  jest.spyOn(emailConfirmationService, 'create').mockResolvedValue({
    id: '123',
    code: '',
    user_id: 'asdf',
  })
  const result = await authService.createUser({
    password: '123',
    email: 'myemail@gmail.com',
  });

  expect(emailConfirmationService.create).toBeCalled()
  expect(emailConfirmationService.sendEmail).toBeCalled()
  expect(result).toEqual(user);
});

test('should return Err object if creation of user failed', async () => {
  jest.spyOn(userService, 'findByEmail').mockResolvedValue(Errors.UserNotFound('denzeldenisq@gmail.com'))
  jest.spyOn(userService, 'createOne').mockResolvedValue(Errors.InternalServerError())
  jest.spyOn(emailConfirmationService, 'create').mockResolvedValue({
    id: '123',
    code: '',
    user_id: 'asdf',
  })
  jest.spyOn(emailConfirmationService, 'sendEmail')

  const result = await authService.createUser({
    password: '123',
    email: 'myemail@gmail.com',
  });

  expect(emailConfirmationService.create).not.toBeCalled()
  expect(emailConfirmationService.sendEmail).not.toBeCalled()
  expect(result).toEqual(Errors.InternalServerError());
});

test('should return Err object if creation of otp failed', async () => {
  const user = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  jest.spyOn(userService, 'findByEmail').mockResolvedValue(Errors.UserNotFound(user.email))
  jest.spyOn(userService, 'createOne').mockResolvedValue(user)
  jest.spyOn(emailConfirmationService, 'sendEmail')
  jest.spyOn(emailConfirmationService, 'create').mockReturnValue(Errors.InternalServerError())

  const result = await authService.createUser({
    password: '123',
    email: 'myemail@gmail.com',
  });

  expect(emailConfirmationService.sendEmail).not.toBeCalled()
  expect(result).toEqual(Errors.InternalServerError());
});

test('should return Err object if email is taken', async () => {
  const user = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };

  jest.spyOn(userService, 'findByEmail').mockResolvedValue(user)
  jest.spyOn(emailConfirmationService, 'sendEmail')

  const result = await authService.createUser({
    password: '123',
    email: 'denzeldenisq@gmail.com',
  })

  expect(emailConfirmationService.sendEmail).not.toBeCalled()
  expect(emailConfirmationService.sendEmail).not.toBeCalled()

  const expected = Errors.EmailIsTaken(user.email)
  expect(result).toStrictEqual(expected);
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
  jest.spyOn(userService, 'findByEmail').mockResolvedValue(user)
  const data = await authService.verifyUser({
    email: 'denzeldenisq@gmail.com',
    password: '123',
  });
  //@ts-ignore
  expect(data.user).toEqual(UserDto.create(user));
});

test('should not verify user if there is no such user', async () => {
  jest.spyOn(userService, 'findByEmail').mockResolvedValue(Errors.UserNotFound('denzeldenisq@gmail.com'))
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
  jest.spyOn(userService, 'findByEmail').mockResolvedValue(user)
  const error = await authService.verifyUser({
    email: 'denzeldenisq@gmail.com',
    password: '123',
  })
  expect(error).toStrictEqual(
    Errors.GeneralInvalid('Password', '123')
  )
});

//verify email
test('should verify email', async () => {
  const otpResult = {
    user: {
      id: '123',
      email: 'denzeldenisq@gmail.com',
      verified: false,
      hash: 'hash',
      created_at: new Date(),
    },
    code: '123456'
  }
  const verifiedUser = {
    id: '123',
    email: 'denzeldenisq@gmail.com',
    verified: true,
    hash: 'hash',
    created_at: new Date(),
  }
  const tokens = {access_token: 'access', refresh_token: 'refresh'}

  jest.spyOn(emailConfirmationService, 'verifyOTP').mockResolvedValue(otpResult)
  jest.spyOn(userService, 'verify').mockResolvedValue(verifiedUser)
  jest.spyOn(tokenService, 'issueTokens').mockReturnValue(tokens)

  const expected = {
    user: UserDto.create(verifiedUser),
    ...tokens
  }
  const result = await authService.verifyEmail({code: "123456", email: "denzeldenisq@gmail.com"})
  expect(result).toEqual(expected)
})