import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';


const router = createBrowserRouter([
    {
      path: '/login',
      element: (
          <LoginPage />
      ),
    },
    {
      path: '/signup',
      element: (
          <SignupPage />
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