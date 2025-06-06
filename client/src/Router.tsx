import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';

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
      <p>not found</p>
    ),
  },
])


export function Router() {
  return <RouterProvider router={router} />;
}