import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './routes'

const router = createBrowserRouter(routes);

export function Router() {
  return <RouterProvider router={router} />;
}