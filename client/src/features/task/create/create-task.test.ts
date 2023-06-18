import { allSettled, fork } from 'effector';
import { test, expect, vi } from 'vitest';
import { $tasksKv } from '@/entities/task';
import { createTaskQuery } from '@/shared/api/task';
import { taskExpansionFactory } from '@/shared/lib/block-expansion';
import { createTaskFactory } from '.';
const taskModel = taskExpansionFactory()
const createTaskModel = createTaskFactory(taskModel)


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
  6: {id: 6, title: 'sixth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
}

const returnedValue = {id: 6, user_id: 1, title: 'sixth', description: 'my note' , status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"}
test('request after closeTaskTriggered event', async () => {
  const mock = vi.fn(() => (returnedValue))
  const { $title, $description, $status,$startDate } = createTaskModel
  const { createTaskClosed } = taskModel
  const scope = fork({
    values: [
      [$title, 'sixth'],
      [$description, 'my note'],
      [$status, 'FINISHED'],
      [$startDate, "2023-06-16 06:48:43 788ms UTC"],
      [$tasksKv, items],
    ],
    handlers: [
      [createTaskQuery.__.executeFx, mock],
    ]
  })
  await allSettled(createTaskClosed, {scope})
  expect(mock).toHaveBeenCalledOnce()
  expect(mock).toBeCalledWith({body: {title: 'sixth', description: 'my note' , status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"}})
  expect(mock).toReturnWith(returnedValue)
  expect(scope.getState($tasksKv)).toStrictEqual(newItems)
})