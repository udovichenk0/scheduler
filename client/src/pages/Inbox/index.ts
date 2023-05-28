import { lazy } from 'react';
import { routes } from '@/shared/config/router';

const Inbox = lazy(() => import('./inbox.page'))

export const InboxRoute = {
    view: Inbox,
    route: routes.inbox,
}