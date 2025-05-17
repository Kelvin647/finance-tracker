import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
  const { user, logout, authMessage, isSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span className="user-greeting">
              {getTimeBasedGreeting()}, {user.username}!
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
      
      {authMessage && (
        <div className={`global-message ${isSuccess ? 'success' : 'error'}`}>
          {authMessage}
        </div>
      )}
    </nav>
  );
}

export default Navbar;