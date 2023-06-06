import { fork, allSettled } from 'effector'
import { expect, test } from 'vitest'
import { $done, $note, $title, checkboxToggled, noteChanged, titleChanged } from './abstract.model'
test('should change the $title', async () => {
    const scope = fork({
        values: [[$title, '']]})
    await allSettled(titleChanged, {
        scope, 
        params: 'title name'
    })
    expect(scope.getState($title)).toBe('title name')
})

test('should change the $note', async () => {
    const scope = fork({
        values: [[$note, '']]})
    await allSettled(noteChanged, {
        scope, 
        params: 'note content'
    })
    expect(scope.getState($note)).toBe('note content')
})
test('should toggle the $done', async () => {
    const scope = fork({
        values: [[$done, false]]})
    await allSettled(checkboxToggled, {scope})
    expect(scope.getState($done)).toBe(true)
})