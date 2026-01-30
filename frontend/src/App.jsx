import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';


const PrivateRoute = ({ role }) => {
    const { user, token, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!token) return <Navigate to="/login" />;

    if (role && user?.role !== role) {
        // Redirect to appropriate dashboard if logged in but wrong role
        if (user?.role === 'admin') return <Navigate to="/admin" />;
        if (user?.role === 'employee') return <Navigate to="/employee" />;
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/login" />} />

                <Route element={<PrivateRoute role="admin" />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                <Route element={<PrivateRoute role="employee" />}>
                    <Route path="/employee" element={<EmployeeDashboard />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
