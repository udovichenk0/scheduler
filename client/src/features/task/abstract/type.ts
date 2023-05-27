// move this type out
type Task = {
    id: number,
    title: string,
    done: boolean,
    note: string,
    date: boolean
}
type ExcludeId = Pick<Task, Exclude<keyof Task, 'id'>>

export type ParamsOptions = {
    kv: Record<number, Task>,
    meta: {
        done: boolean,
        title: string,
        note: string,
    },
    id: number | null
}

export type Params = {
    kv: Record<number, Task>,
    meta: ExcludeId,
    id: number
}