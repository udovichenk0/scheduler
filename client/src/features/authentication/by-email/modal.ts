import { createEvent, createStore, sample } from "effector";
import { createEffect } from "effector/effector.mjs";
import { FormEvent } from "react";
import { z } from 'zod'

export const emailChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetTriggered = createEvent()

export const $email = createStore('')
export const $emailError = createStore<'too_small' | 'invalid_string' |  null>(null)
const emailSchema = z.string().email().min(4)

export const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitTriggered()
}

const checkUserFx = createEffect(async(email:string) => {
    console.log(email)
    return email
})

sample({
    clock: emailChanged,
    target: $email
})

// fetch after success email validation
sample({
    clock: submitTriggered,
    source: $email,
    filter: (email) => emailSchema.safeParse(email).success,
    target: checkUserFx
})

// store an error after failure validation
sample({
    clock: submitTriggered,
    source: $email,
    filter: (email) => !emailSchema.safeParse(email).success,    
    fn: checkError,
    target: $emailError
})
// restore emailError
sample({
    clock: resetTriggered,
    target: [$emailError.reinit!, $email.reinit!]
})

function checkError(email:string){
    if(email.length < 4){
        return 'too_small'
    }
    else {
        return 'invalid_string'
    }
}

