import { allSettled, fork } from 'effector';
import { test, expect, vi } from 'vitest';
import { $tasksKv } from '@/entities/task';
import { createTaskQuery } from '@/shared/api/task';
import { taskExpansionFactory } from '@/shared/lib/block-expansion';
import { createTaskFactory } from '.';
const taskModel = taskExpansionFactory()
const createTaskModel = createTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})


const items = {
  1: {id: 1,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  2: {id: 2,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  3: {id: 3,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  4: {id: 4,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  5: {id: 5,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
}
const newItems = {
  1: {id: 1,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  2: {id: 2,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  3: {id: 3,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  4: {id: 4,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  5: {id: 5,title: "without date",description: "",type: "inbox",status: "INPROGRESS",start_date: null,user_id: 1},
  6: {id: 6,title: "sixth",description: "my note",type: "inbox",status: "FINISHED", start_date: null,user_id: 1},
}
const returnedValue = {id: 6,title: "sixth",description: "my note",type: "inbox",status: "FINISHED", start_date: null,user_id: 1}
test('request after closeTaskTriggered event', async () => {
  const mock = vi.fn(() => (returnedValue))
  const { $title, $description, $status, $startDate, $isAllowToSubmit, $type } = createTaskModel
  const { createTaskClosed } = taskModel
  const scope = fork({
    values: [
      [$title, 'sixth'],
      [$description, 'my note'],
      [$status, 'FINISHED'],
      [$startDate, null],
      [$type, 'inbox'],
      [$isAllowToSubmit, true],
      [$tasksKv, items],
    ],
    handlers: [
      [createTaskQuery.__.executeFx, mock],
    ]
  })
  await allSettled(createTaskClosed, {scope})
  expect(mock).toHaveBeenCalledOnce()
  expect(mock).toBeCalledWith({body: {title: 'sixth', description: 'my note',type: 'inbox', status: 'FINISHED', start_date: null}})
  expect(mock).toReturnWith(returnedValue)
  expect(scope.getState($tasksKv)).toStrictEqual(newItems)
})