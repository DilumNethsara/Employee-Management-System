import { useState } from 'react';
import Navbar from '../components/Navbar';
import EmployeeManager from '../components/admin/EmployeeManager';
import DepartmentManager from '../components/admin/DepartmentManager';
import LeaveManager from '../components/admin/LeaveManager';
import '../resources/css/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('employees');

    return (
        <div className="admin-page">
            <div className="admin-bg"></div>

            <Navbar title="EMS Admin" />

            <div className="admin-container">
                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'employees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('employees')}
                    >
                        Employees
                    </button>

                    <button
                        className={`admin-tab ${activeTab === 'departments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('departments')}
                    >
                        Departments
                    </button>

                    <button
                        className={`admin-tab ${activeTab === 'leaves' ? 'active' : ''}`}
                        onClick={() => setActiveTab('leaves')}
                    >
                        Leave Requests
                    </button>
                </div>

                {/* Content */}
                <div className="admin-card">
                    {activeTab === 'employees' && <EmployeeManager />}
                    {activeTab === 'departments' && <DepartmentManager />}
                    {activeTab === 'leaves' && <LeaveManager />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
