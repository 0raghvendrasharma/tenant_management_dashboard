import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('tenantUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tenantUser');
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <Dashboard user={user} />
        </>
      )}
    </>
  );
}

export default App;
