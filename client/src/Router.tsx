import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

const router = createBrowserRouter([
    {
    path: '/login',
    element: (
        <LoginPage />
    ),
  },
    {
    path: '*',
    element: (
      <NotFoundPage />
    ),
  },
])


export function Router() {
  return <RouterProvider router={router} />;
}