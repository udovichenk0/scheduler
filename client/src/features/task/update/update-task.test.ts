import { fork, allSettled, createEvent } from 'effector'
import { test, expect, vi } from 'vitest'
import { $tasksKv } from '@/entities/task'
import { updateTaskQuery } from '@/shared/api/task'
import { taskExpansionFactory } from '@/shared/lib/block-expansion'
import { updateTaskFactory } from '.'

const taskModel = taskExpansionFactory()
const updateTaskModel = updateTaskFactory(taskModel)

const items = {
  1: {id: 1, title: 'first', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  2: {id: 2, title: 'second', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  3: {id: 3, title: 'third', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  4: {id: 4, title: 'fourth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  5: {id: 5, title: 'fifth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
}

const newItems = {
  1: {id: 1, title: 'first', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  2: {id: 2, title: 'second', description: 'my note' , user_id: 1,  status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  3: {id: 3, title: 'third', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  4: {id: 4, title: 'fourth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  5: {id: 5, title: 'fifth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
  6: {id: 6, title: 'title', description: 'my description' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
}

const returnedValue = {id: 6, user_id: 1, title: 'title', description: 'my description' , status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"}
test('should set fields after task is selected', async () => {
  const mock = vi.fn(() => returnedValue)  
  const { $status, $description,$isDirty, $title } = updateTaskModel
  const { updateTaskClosed } = taskModel
  const scope = fork({
    values: [
      [$tasksKv, items],
      [$title, 'title'],
      [$description, 'my description'],
      [$status, 'FINISHED'],
      [$isDirty, true]  
    ],
    handlers: [
      [updateTaskQuery.__.executeFx, mock]
    ]
  })
  await allSettled(updateTaskClosed, {scope, params: 6})

  expect(mock).toHaveBeenCalledOnce()
  expect(mock).toReturnWith(returnedValue)
  expect(scope.getState($tasksKv)).toStrictEqual(newItems)
  expect(scope.getState($isDirty)).toBeFalsy()
})