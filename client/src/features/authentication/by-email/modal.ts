import { createEvent, createStore, sample, createEffect, attach } from "effector";
import { debug } from "patronum";
import { z } from 'zod'
import { getUserQuery } from "@/shared/api/user";

export const emailChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetEmailTriggered = createEvent()

export const $email = createStore('')
export const $emailError = createStore<'too_small' | 'invalid_string' |  null>(null)

const emailSchema = z.string().email().min(4)

sample({
    clock: emailChanged,
    target: $email
})


// fetch after success email validation
sample({
    clock: submitTriggered,
    source: $email,
    filter: (email) => emailSchema.safeParse(email).success,
    fn: (email) => ({email}),
    target: getUserQuery.start
})

//denzel2.eni@gmail.com
debug(getUserQuery.$data)

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
    clock: resetEmailTriggered,
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

