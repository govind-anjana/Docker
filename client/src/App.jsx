import { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

  // Check for existing token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setSession({
        token,
        user: JSON.parse(userStr)
      });
    }
  }, []);

  const handleAuthSuccess = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setSession({ token, user });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession(null);
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>My Awesome App</h1>
        {session && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </header>

      <main className="app-main">
        {session ? (
          <div className="dashboard">
            <h2>Welcome, {session.user.email}!</h2>
            <p>You have successfully logged in.</p>
            <div className="dashboard-content">
              <h3>Secure Dashboard</h3>
              <p>This content is only visible to authenticated users. The database and Docker backend integration is fully functioning.</p>
            </div>
          </div>
        ) : (
          <div className="auth-wrapper">
            {activeTab === 'login' ? (
              <Login
                onSwitchToSignup={() => setActiveTab('signup')}
                onLoginSuccess={handleAuthSuccess}
              />
            ) : (
              <Signup
                onSwitchToLogin={() => setActiveTab('login')}
                onSignupSuccess={handleAuthSuccess}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
