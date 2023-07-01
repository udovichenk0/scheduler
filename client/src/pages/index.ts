import { createRoutesView } from 'atomic-router-react';
import { InboxRoute } from './Inbox';
import { HomeRoute } from './Today'

const routes = [HomeRoute, InboxRoute]

export const RoutesView = createRoutesView({routes})
