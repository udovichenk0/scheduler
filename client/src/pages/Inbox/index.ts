import { lazy } from 'react';
import { MainLayout } from '@/widgets/layouts/main/ui';
import { routes } from '@/shared/config/router';

const Inbox = lazy(() => import('./inbox.page'))

export const InboxRoute = {
    view: Inbox,
    route: routes.inbox,
    layout: MainLayout
}