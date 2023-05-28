import { createStore, fork, allSettled } from 'effector'
import { test, expect, describe } from 'vitest'
import { Task } from '@/shared/api/task'
import { $done, $note, $title } from '../abstract'
import { updateTaskFactory } from '.'
const tasks = {
    1: {id: 1, done: false, title: "make something", note: "description 1", date: true},
    2: {id: 2, done: false, title: "make anything", note: "description 2", date: true},
    3: {id: 3, done: true, title: "done task", note: "description 3", date: false},
    4: {id: 4, done: false, title: "go to there", note: "description 4", date: true},
}
const $kv = createStore<Record<number, Task>>(tasks)
const taskModel = updateTaskFactory({tasks: $kv})

const updatedTasks = {
    1: {id: 1, done: false, title: "make something", note: "description 1", date: true},
    2: {id: 2, done: true, title: "my title", note: "my note", date: true},
    3: {id: 3, done: false, title: "done task", note: "description 3", date: false},
    4: {id: 4, done: false, title: "go to there", note: "description 4", date: true},
}
// restore objects after each test
test('set updated task id', async () => {
    const { $activeTaskId, expandTaskTriggered } = taskModel
    const scope = fork({
        values: [
            [$activeTaskId, null]
        ]
    }) 
    await allSettled(expandTaskTriggered, {scope, params: 2})
    expect(scope.getState($activeTaskId)).toBe(2)
})
test('update task', async () => {
    const { $activeTaskId, closeExpandedTask, doneTaskToggled } = taskModel
    const scope = fork({
        values: [
            [$title, 'my title'],
            [$note, 'my note'],
            [$done, true],       
            [$activeTaskId, 2],
            [$kv, tasks]
        ]
    })
    await allSettled(closeExpandedTask, {scope})
    await allSettled(doneTaskToggled, {scope, params: 3})
    expect(scope.getState($kv)).toStrictEqual(updatedTasks)
})
