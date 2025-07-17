import type { RouteObject } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { VerifyPage } from '../pages/VerifyPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { GoogleCallbackPage } from '../pages/GoogleCallbackPage';
import { QuestsPage } from '../pages/QuestsPage';
import { QuestDetailsPanel } from '../components/quest-details/QuestDetailsPanel';

export type AppRouteObject = RouteObject & {
	title?: string;
	children?: AppRouteObject[]; // recursively type any children to be of AppRouteObject
}

export const routes: AppRouteObject[] = [
    {
    	path: '/quests',
    	element: (
        	<QuestsPage />
      	),
      	title: 'Map',
      	children: [
			{
			path: ':id',
			element: (
				<QuestDetailsPanel />
			),
			},
      	]
    },
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
		path: '/reset-password',
		element: (
			<ResetPasswordPage />
		),
		title: 'Reset Password'
    },
    {
		path: '/google-callback',
		element: (
			<GoogleCallbackPage />
		),
		title: 'Signing you in...'
    },
    {
		path: '*',
		element: (
			<NotFoundPage />
		),
		title: '404 Not Found'
  	},
]