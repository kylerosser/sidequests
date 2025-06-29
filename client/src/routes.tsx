import type { RouteObject } from 'react-router';

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';


export type AppRouteObject = RouteObject & {
  title?: string;
  children?: AppRouteObject[]; // recursively type any children to be of AppRouteObject
}

export const routes: AppRouteObject[] = [
    {
      path: '/login',
      element: (
          <LoginPage />
      ),
      title: 'Login'
    },
    {
      path: '/signup',
      element: (
          <SignupPage />
      ),
      title: 'Create Account'
    },
    {
    path: '*',
    element: (
      <NotFoundPage />
    ),
    title: '404 Not Found'
  },
]