import { extend } from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { fork, sample, allSettled } from 'effector'

import { Provider } from 'effector-react'
import {createRoot} from 'react-dom/client'

import App from './app/App'
import './app/index.css'
import { getTasksTriggered } from './entities/task/tasks'
import { refreshQuery } from './shared/api/token'
import { appStarted } from './shared/config/init'

extend(isSameOrAfter)
extend(isSameOrBefore)

const scope = fork();

sample({
  clock: appStarted,
  target: [refreshQuery.start]
})
sample({
  clock: refreshQuery.finished.success,
  target: getTasksTriggered
})
appStarted()
await allSettled(appStarted, { scope });

createRoot(document.getElementById('root') as HTMLElement).
render(
  // <Provider value={scope}>
    <App />
  // </Provider>
)