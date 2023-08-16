import { allSettled, fork } from "effector";
import { describe, test, expect, vi, afterEach } from "vitest";

import { $sessionUser } from '@/entities/session/session.model';

import { signinQuery } from '@/shared/api/auth/auth.api';

import { $email } from "../by-email";

import { $password,  $passwordError,  passwordChanged, submitTriggered } from ".";
const userDto = {
  user: {
        id: '1',
        email: 'myemail@gmail.com',
        verified: true,
    },
    access_token: 'access_token',
    refresh_token: 'refresh_token',
}
const sessionUser = {
  id: '1',
  email: 'myemail@gmail.com',
  verified: true,
}
describe('signin', () => {
  const mock = vi.fn(() => userDto)
  const scope = fork({
  values: [
    [$password, ''],
    [$email, 'myemail@gmail.com'],
    [$sessionUser, null]
  ],
  handlers: [
    [signinQuery.__.executeFx, mock]
  ]
})
  afterEach(() => {
    mock.mockClear()
  })
  test('signin and set user to the store', async () => {

  await allSettled(passwordChanged, {scope, params: 'mypassword'})

  expect(scope.getState($password)).toBe('mypassword')

  await allSettled(submitTriggered, {scope})
  expect(scope.getState($sessionUser)).toStrictEqual(sessionUser)
})

  test('check password validation', async () => {
    await allSettled(passwordChanged, {scope, params: 'superlongpasswordsuperlongpasswordsuperlongpasswordsuperlsuperlongpasswordsuperlongpasswordongpassw'})
    await allSettled(submitTriggered, {scope})
    expect(scope.getState($passwordError)).not.toBeNull()
    expect(mock).not.toBeCalled()
  })
})