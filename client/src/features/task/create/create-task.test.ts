import { allSettled, createEvent, fork } from 'effector';
import { test, expect, vi } from 'vitest';
import { $title, $note, $done } from '@/features/task/abstract'
import { $tasksKv } from '@/entities/task';
import { createTaskFactory, createTaskFx } from '.';

const tasks = {
    1: {id: 1, done: false, title: "make something", note: "description 1", date: true},
    2: {id: 2, done: false, title: "make anything", note: "description 2", date: true},
    3: {id: 3, done: true, title: "done task", note: "description 3", date: false},
    4: {id: 4, done: false, title: "go to there", note: "description 4", date: true},
}
const closeTaskTriggered = createEvent()
const taskModel = createTaskFactory({closeTaskTriggered})

test('change activeNewTask to true', async () => {
    const { $activeNewTask, createTaskTriggered} = taskModel
    const scope = fork({
        values: [
            [$activeNewTask, false]
        ]
    })
    await allSettled(createTaskTriggered, {scope})
    expect(scope.getState($activeNewTask)).toBe(true)
})


const newKv = {
    1: {id: 1, done: false, title: "make something", note: "description 1", date: true},
    2: {id: 2, done: false, title: "make anything", note: "description 2", date: true},
    3: {id: 3, done: true, title: "done task", note: "description 3", date: false},
    4: {id: 4, done: false, title: "go to there", note: "description 4", date: true},
    5: {id: 5, title: 'my title', note: 'my note' , done: true, date: true}
}

test('request after closeTaskTriggered event', async () => {
    const mock = vi.fn(({title, note, done}) => ({id: 5, title, note, done, date: true}))
    const { $activeNewTask } = taskModel
    const scope = fork({
        values: [
            [$title, 'my title'],
            [$note, 'my note'],
            [$done, true],
            [$tasksKv, tasks],
            [$activeNewTask, true],
        ],
        handlers: [
            [createTaskFx, mock]
        ]
    })
    await allSettled(closeTaskTriggered, { scope })

    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith({title: 'my title', note: 'my note' , done: true})
    expect(mock).toReturnWith({id: 5, title: 'my title', note: 'my note' , done: true, date: true})
    expect(scope.getState($tasksKv)).toStrictEqual(newKv)
})