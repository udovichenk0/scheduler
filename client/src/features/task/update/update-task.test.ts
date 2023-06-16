// import { fork, allSettled, createEvent } from 'effector'
// import { test, expect } from 'vitest'
// import { $tasksKv } from '@/entities/task'
// import { updateTaskFactory } from '.'
// const tasks = {
//     1: {id: 1, done: false, title: "make something", note: "description 1", date: true},
//     2: {id: 2, done: false, title: "make anything", note: "description 2", date: true},
//     3: {id: 3, done: true, title: "done task", note: "description 3", date: false},
//     4: {id: 4, done: false, title: "go to there", note: "description 4", date: true},
// }

// const closeTaskTriggered = createEvent()
// const updateTaskOpened = createEvent<number>()
// const taskModel = updateTaskFactory(updateTaskOpened)

// const items = {
//     1: {id: 1, title: 'first', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     2: {id: 2, title: 'second', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     3: {id: 3, title: 'third', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     4: {id: 4, title: 'fourth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     5: {id: 5, title: 'fifth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
// }

// const newItems = {
// 	1: {id: 1, title: 'first', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     2: {id: 2, title: 'second', description: 'my note' , user_id: 1,  status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     3: {id: 3, title: 'third', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     4: {id: 4, title: 'fourth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
//     5: {id: 5, title: 'fifth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
// 	6: {id: 6, title: 'sixth', description: 'my note' , user_id: 1, status: 'FINISHED', start_date: "2023-06-16 06:48:43 788ms UTC"},
// }
// test('should update task', async () => {
//     const { doneTaskToggled, updateTaskTriggered, $status, $description, $title } = taskModel
//     const scope = fork({
//         values: [
//             [$title, 'my title'],
//             [$description, 'my note'],
//             [$status, 'FINISHED'],   
//             [$tasksKv, items]
//         ]
//     })
//     await allSettled(closeTaskTriggered, {scope})
//     await allSettled(doneTaskToggled, {scope, params: 3})
//     // await allSettled(updateTaskTriggered, {scope, params: 3})
//     // expect(scope.getState($tasksKv)).toStrictEqual(updatedTasks)
//     // expect(scope.getState($activeTaskId)).toBe(3)
// })

// test('should set fields after task is selected', async () => {
//     const { updateTaskTriggered, $done, $note, $title } = taskModel
//     const scope = fork({
//         values: [
//             [$tasksKv, tasks],
//             [$title, ''],
//             [$note, ''],
//             [$done, false],  
//         ]
//     })
//     await allSettled(updateTaskTriggered, {scope, params: 4})

//     expect(scope.getState($title)).toBe("go to there")
//     expect(scope.getState($note)).toBe("description 4")
//     expect(scope.getState($done)).toBe(false)
// })

// test('should not update task', async () => {
//     const { $done, $note, $title } = taskModel
//     const scope = fork({
//         values: [
//             [$title, 'my title'],
//             [$note, 'my note'],
//             [$done, true],   
//             [$tasksKv, tasks]
//         ]
//     })
//     await allSettled(closeTaskTriggered, {scope})
//     expect(scope.getState($tasksKv)).toStrictEqual(tasks)
// })