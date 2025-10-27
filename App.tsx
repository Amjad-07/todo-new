
import React, { useState } from 'react';
// FIX: Import `useAuth` from the correct file `./hooks/useAuth` instead of `./contexts/AuthContext`.
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const toggleForm = () => setIsSigningUp(!isSigningUp);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {isSigningUp ? (
            <Signup onToggleForm={toggleForm} />
          ) : (
            <Login onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default App;