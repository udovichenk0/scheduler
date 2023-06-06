import { fork, allSettled, createEvent } from 'effector'
import { test, expect } from 'vitest'
import { $tasksKv } from '@/entities/task'
import { updateTaskFactory } from '.'
const tasks = {
    1: {id: 1, done: false, title: "make something", note: "description 1", date: true},
    2: {id: 2, done: false, title: "make anything", note: "description 2", date: true},
    3: {id: 3, done: true, title: "done task", note: "description 3", date: false},
    4: {id: 4, done: false, title: "go to there", note: "description 4", date: true},
}

const closeTaskTriggered = createEvent()
const taskModel = updateTaskFactory({closeTaskTriggered})

const updatedTasks = {
    1: {id: 1, done: false, title: "make something", note: "description 1", date: true},
    2: {id: 2, done: true, title: "my title", note: "my note", date: true},
    3: {id: 3, done: false, title: "done task", note: "description 3", date: false},
    4: {id: 4, done: false, title: "go to there", note: "description 4", date: true},
}
// restore objects after each test
test('set updated task id', async () => {
    const { $activeTaskId, updateTaskTriggered } = taskModel
    const scope = fork({
        values: [
            [$activeTaskId, null]
        ]
    }) 
    await allSettled(updateTaskTriggered, {scope, params: 2})
    expect(scope.getState($activeTaskId)).toBe(2)
})
test('should update task', async () => {
    const { $activeTaskId, doneTaskToggled, updateTaskTriggered, $done, $note, $title } = taskModel
    const scope = fork({
        values: [
            [$title, 'my title'],
            [$note, 'my note'],
            [$done, true],   
            [$activeTaskId, 2],
            [$tasksKv, tasks]
        ]
    })
    await allSettled(closeTaskTriggered, {scope})
    await allSettled(doneTaskToggled, {scope, params: 3})
    await allSettled(updateTaskTriggered, {scope, params: 3})
    expect(scope.getState($tasksKv)).toStrictEqual(updatedTasks)
    expect(scope.getState($activeTaskId)).toBe(3)
})

test('should set fields after task is selected', async () => {
    const { updateTaskTriggered, $done, $note, $title } = taskModel
    const scope = fork({
        values: [
            [$tasksKv, tasks],
            [$title, ''],
            [$note, ''],
            [$done, false],  
        ]
    })
    await allSettled(updateTaskTriggered, {scope, params: 4})

    expect(scope.getState($title)).toBe("go to there")
    expect(scope.getState($note)).toBe("description 4")
    expect(scope.getState($done)).toBe(false)
})

test('should not update task', async () => {
    const { $done, $note, $title } = taskModel
    const scope = fork({
        values: [
            [$title, 'my title'],
            [$note, 'my note'],
            [$done, true],   
            [$tasksKv, tasks]
        ]
    })
    await allSettled(closeTaskTriggered, {scope})
    expect(scope.getState($tasksKv)).toStrictEqual(tasks)
})