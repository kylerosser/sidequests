import type { RouteObject } from 'react-router';

import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { VerifyPage } from '../pages/VerifyPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';


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
      path: '/verify',
      element: (
          <VerifyPage />
      ),
      title: 'Verify'
    },
    {
      path: '/forgot-password',
      element: (
          <ForgotPasswordPage />
      ),
      title: 'Forgot Password'
    },
    {
    path: '*',
    element: (
      <NotFoundPage />
    ),
    title: '404 Not Found'
  },
]