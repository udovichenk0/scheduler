
import { HomeRoute } from './Home'
//@ts-expect-error
import { createRoutesView } from 'atomic-router-react';
const routes = [HomeRoute]

export const RoutesView = createRoutesView({routes})
