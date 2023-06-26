import { fork, allSettled } from 'effector'
import { test, expect, vi } from 'vitest'
import { $tasksKv } from '@/entities/task'
import { updateTaskQuery } from '@/shared/api/task'
import { taskExpansionFactory } from '@/shared/lib/block-expansion'
import { updateTaskFactory } from '.'

const taskModel = taskExpansionFactory()
const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})

const items = {
  1: {"id": 1,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  2: {"id": 2,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  3: {"id": 3,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  4: {"id": 4,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  5: {"id": 5,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
}

const newItems = {
  1: {"id": 1,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  2: {"id": 2,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  3: {"id": 3,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  4: {"id": 4,"title": "without date","description": "","type": "inbox","status": "INPROGRESS","start_date": null,"user_id": 1},
  5: {"id": 5,"title": "title","description": "my description","type": "inbox","status": "FINISHED","start_date": null,"user_id": 1},
}

const returnedValue = {"id": 5,"title": "title","description": "my description","type": "inbox","status": "FINISHED","start_date": null,"user_id": 1}
test('should set fields after task is selected', async () => {
  const mock = vi.fn(() => returnedValue)  
  const { $status, $description,$isDirty, $title, $type, $date } = updateTaskModel
  const { updateTaskClosed } = taskModel
  const scope = fork({
    values: [
      [$tasksKv, items],
      [$title, 'title'],
      [$description, 'my description'],
      [$status, 'FINISHED'],
      [$type, 'inbox'],
      [$date, null],
      [$isDirty, true],
    ],
    handlers: [
      [updateTaskQuery.__.executeFx, mock]
    ]
  })
  await allSettled(updateTaskClosed, {scope, params: 5})

  expect(mock).toHaveBeenCalledOnce()
  expect(mock).toReturnWith(returnedValue)

  expect(scope.getState($tasksKv)).toStrictEqual(newItems)
  expect(scope.getState($isDirty)).toBeFalsy()
})