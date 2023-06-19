import {createRoot} from 'react-dom/client'

import App from './app/App'
import './app/index.css'
import { appStarted } from './shared/config/init'

appStarted()
createRoot(document.getElementById('root') as HTMLElement).render(<App />)