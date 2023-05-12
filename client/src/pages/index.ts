
import { createRoutesView } from 'atomic-router-react';

import { HomeRoute } from './Home'
//@ts-expect-error
const routes = [HomeRoute]

export const RoutesView = createRoutesView({routes})
