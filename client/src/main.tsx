import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from './Router';
import './index.css'

import { AuthProvider } from './auth/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router/>
    </AuthProvider>
  </StrictMode>,
)
