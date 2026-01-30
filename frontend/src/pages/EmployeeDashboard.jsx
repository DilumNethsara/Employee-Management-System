import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../resources/css/AdminDashboard.css';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const emp = user?.employee;

    const [leaves, setLeaves] = useState([]);
    const [leaveForm, setLeaveForm] = useState({ leave_type: 'Sick', start_date: '', end_date: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves');
            setLeaves(res.data);
        } catch (error) {
            console.error("Failed to fetch leaves");
        }
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/leaves', leaveForm);
            setMessage('Leave applied successfully!');
            setLeaveForm({ leave_type: 'Sick', start_date: '', end_date: '' });
            fetchLeaves();
        } catch (error) {
            setMessage('Failed to apply: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-bg"></div>
            <Navbar title="Employee Dashboard" />

            <div className="admin-container">
                <div className="dashboard-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '1.5rem',
                    alignItems: 'start'
                }}>

                    <div className="admin-card profile-card">
                        <h3 className="profile-title">My Profile</h3>
                        <div className="profile-details">
                            <p><strong>Name:</strong> <span>{user?.name}</span></p>
                            <p><strong>Email:</strong> <span>{user?.email}</span></p>
                            <hr />
                            <p><strong>Department:</strong> <span>{emp?.department?.name || '-'}</span></p>
                            <p><strong>Role:</strong> <span>{emp?.role || '-'}</span></p>
                            <p><strong>Phone:</strong> <span>{emp?.phone || '-'}</span></p>
                            <p><strong>Joining Date:</strong> <span>{emp?.joining_date || '-'}</span></p>
                            <p><strong>Salary:</strong> <span>${emp?.salary || '-'}</span></p>
                        </div>
                    </div>



                    <div className="admin-card">
                        <h3>Apply for Leave</h3>
                        {message && <div style={{ color: message.includes('successfully') ? '#d1fae5' : '#fee2e2', marginBottom: '10px' }}>{message}</div>}
                        <form onSubmit={handleApplyLeave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                            <div>
                                <label>Type</label>
                                <select
                                    value={leaveForm.leave_type}
                                    onChange={e => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                                    className="admin-tab"
                                >
                                    <option value="Sick">Sick</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Vacation">Vacation</option>
                                </select>
                            </div>
                            <div>
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={leaveForm.start_date}
                                    onChange={e => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={leaveForm.end_date}
                                    onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Apply</button>
                        </form>
                    </div>


                    <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
                        <h3>Leave History</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Status</th>
                                        <th>Applied On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.length > 0 ? leaves.map(leave => (
                                        <tr key={leave.id}>
                                            <td>{leave.leave_type}</td>
                                            <td>{leave.start_date}</td>
                                            <td>{leave.end_date}</td>
                                            <td>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: leave.status === 'approved' ? '#d1fae5' : leave.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                                    color: leave.status === 'approved' ? '#065f46' : leave.status === 'rejected' ? '#991b1b' : '#92400e'
                                                }}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td>{new Date(leave.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>No leave history</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
