import { fork, allSettled } from 'effector'
import { expect, test } from 'vitest'
import { abstractTaskFactory } from './abstract.model'
const abstactModel = abstractTaskFactory()
test('should change the $title', async () => {
  const { $title, titleChanged } = abstactModel
  const scope = fork({
    values: [[$title, '']]})
  await allSettled(titleChanged, {
    scope, 
    params: 'title name'
  })
  expect(scope.getState($title)).toBe('title name')
})

test('should change the $note', async () => {
  const { $description, descriptionChanged } = abstactModel
  const scope = fork({
    values: [[$description, '']]})
  await allSettled(descriptionChanged, {
    scope, 
    params: 'note content'
  })
  expect(scope.getState($description)).toBe('note content')
})
test('should toggle the $done', async () => {
  const { $status, statusChanged } = abstactModel
  const scope = fork({
    values: [[$status, false]]})
  await allSettled(statusChanged, {scope})
  expect(scope.getState($status)).toBe('FINISHED')
})