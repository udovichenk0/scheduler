import { createEffect } from "effector"

export const getTasksFx = createEffect(async () => {
    return [
        {id: 1, done: false, title: "make something", note: "description 1", date: true},
        {id: 2, done: false, title: "make anything", note: "description 2", date: true},
        {id: 3, done: true, title: "done task", note: "description 3", date: false},
        {id: 4, done: false, title: "go to there", note: "description 4", date: true},
    ]
})