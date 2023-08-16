import { fork, allSettled } from 'effector';
import { expect, test, vi } from 'vitest'

import { $sessionUser } from '@/entities/session/session.model';

import { verifyQuery } from '@/shared/api/auth';

import { $email } from '../by-email';

import { $code, codeChanged } from './verify.model';
const userDto = {
  user: {
        id: '1',
        email: 'myemail@gmail.com',
        verified: true,
    },
    access_token: 'access_token',
    refresh_token: 'refresh_token',
}
test('verify email', async () => {
  const mock = vi.fn(() => userDto)
  const scope = fork({
    values: [
      [$code, ''],
      [$sessionUser, null],
      [$email, 'myemail@gmail.com']
    ],
    handlers: [
      [verifyQuery.__.executeFx, mock]
    ]
  })
  await allSettled(codeChanged, {
    scope,
    params: '123456'  
  })
  expect(scope.getState($code)).toBe('123456')
  expect(mock).toHaveBeenCalledOnce()
  console.log(mock.mock.calls)
  expect(scope.getState($sessionUser)).not.toBeNull()
})