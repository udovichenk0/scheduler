import { createMockContext } from 'src/services/clients/prisma';
import { UserService } from '../../user.service';
import { UserRepository } from '../repository/user.repository';
import { Errors } from 'src/services/err/errors';

let userRepository: UserRepository
let userService: UserService;


beforeEach(() => {
  userRepository = new UserRepository(createMockContext().prisma)
  userService = new UserService(userRepository);
});
const user = {
  id: '123',
  email: 'user@gmail.com',
  verified: true,
  hash: 'hash',
  created_at: new Date("2024-02-27T16:52:53.877Z"),
};
test('should find a user', async () => {
  jest.spyOn(userRepository, 'findById').mockResolvedValue(user)
  await expect(userService.findById('123')).resolves.toStrictEqual(user);
});
test('should return not found user error object', async () => {
  jest.spyOn(userRepository, 'findById').mockResolvedValue(null)
  const expected = Errors.GeneralNotFound('User', '123')

  await expect(userService.findById('123')).resolves.toStrictEqual(expected);
})

test('find verified user', async () => {
  jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user)
  const expected = {
    id: '123',
    email: 'user@gmail.com',
    verified: true,
  };
  await expect(userService.findVerifiedUserByEmail('user@gmail.com'))
    .resolves.toStrictEqual(expected);
});

test('find unverified user', async () => {
  const unverifiedUser = {
    id: '123',
    email: 'user@gmail.com',
    verified: false,
    hash: 'hash',
    created_at: new Date(),
  };
  jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(unverifiedUser)
  const expected = Errors.UserNotFound('user@gmail.com');
  expect(await userService.findVerifiedUserByEmail('user@gmail.com')).toEqual(
    expected,
  );
});
