import { createRoutesView } from 'atomic-router-react';
import { HomeRoute } from './Home'
import { InboxRoute } from './Inbox';

const routes = [HomeRoute, InboxRoute]

export const RoutesView = createRoutesView({routes})
