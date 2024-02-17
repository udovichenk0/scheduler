import { MockContext, createMockContext } from 'src/services/clients/prisma';
import { UserService } from '../user/user.service';
let mockCtx: MockContext;
let userService: UserService;
beforeEach(() => {
  mockCtx = createMockContext();
  userService = new UserService(mockCtx.prisma);
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
  await expect(userService.findOne({ id: '123' })).resolves.toEqual(user);
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
  expect(await userService.findVerifiedUser({ id: '123' })).toEqual(
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
  expect(await userService.findVerifiedUser({ id: '123' })).toEqual(
    returnedValue,
  );
});
