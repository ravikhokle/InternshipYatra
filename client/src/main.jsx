import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/ReactToastify.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AppTree = () => (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

createRoot(document.getElementById('root')).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppTree />
    </GoogleOAuthProvider>
  ) : (
    <AppTree />
  )
)
