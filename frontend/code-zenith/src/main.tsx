import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from '../App.tsx'

const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID?.trim();

const app = <App />;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {clientId ? (
      <GoogleOAuthProvider clientId={clientId}>
        {app}
      </GoogleOAuthProvider>
    ) : (
      app
    )}
  </React.StrictMode>,
)
