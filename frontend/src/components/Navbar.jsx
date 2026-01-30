import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../resources/css/Navbar.css';

const Navbar = ({ title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar-glass">
            <div className="navbar-container">
                <h2 className="navbar-title">{title || 'EMS'}</h2>

                <div className="navbar-right">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>

                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
