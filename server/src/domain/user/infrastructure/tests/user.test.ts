import { MockContext, createMockContext } from 'src/services/clients/prisma';
import { UserService } from '../../user.service';
import { UserRepository } from '../repository/user.repository';
let mockCtx: MockContext;
let userService: UserService;
let userRepository: UserRepository
beforeEach(() => {
  mockCtx = createMockContext();
  userRepository = new UserRepository(mockCtx.prisma)
  userService = new UserService(userRepository);
});
const user = {
  id: '123',
  email: 'hello@prisma.io',
  verified: true,
  hash: 'hash',
  created_at: new Date(),
};
test('should find a user', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(user);
  await expect(userService.findById('123')).resolves.toEqual(user);
});

test('should create user', async () => {
  mockCtx.prisma.user.create.mockResolvedValue(user);
  await expect(
    userService.createOne({ email: 'hello@prisma.io', password: '123' }),
  ).resolves.toEqual(user);
});

test('find verified user', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(user);
  const returnedValue = {
    id: '123',
    email: 'hello@prisma.io',
    verified: true,
  };
  expect(await userService.findVerifiedUserByEmail('123')).toEqual(
    returnedValue,
  );
});

test('find unverified user', async () => {
  const unverifiedUser = {
    id: '123',
    email: 'hello@prisma.io',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  mockCtx.prisma.user.findUnique.mockResolvedValue(unverifiedUser);
  const returnedValue = {
    error: 'not_found',
    message: 'User is not created',
  };
  expect(await userService.findVerifiedUserByEmail('123')).toEqual(
    returnedValue,
  );
});
