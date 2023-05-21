import { sample } from "effector";
import { createEvent } from "effector/compat";
import { resetSession } from "@/entities/session";
import { logoutQuery } from "@/shared/api/auth";
import { resetToken } from "@/shared/api/token";

export const submitTriggered = createEvent()

sample({
    clock: submitTriggered,
    target: logoutQuery.start
})

sample({
    clock: logoutQuery.finished.success,
    target: [resetSession, resetToken]
})