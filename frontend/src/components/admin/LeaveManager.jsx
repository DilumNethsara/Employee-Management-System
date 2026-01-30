import { useState, useEffect } from 'react';
import api from '../../api/axios';

const LeaveManager = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves');
            setLeaves(res.data);
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            fetchLeaves();
        } catch (error) {
            console.error(error);
            alert('Update failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this leave request?')) return;
        try {
            await api.delete(`/leaves/${id}`);
            fetchLeaves();
        } catch (error) {
            console.error(error);
            alert('Delete failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h3>Leave Requests</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map(leave => (
                            <tr key={leave.id}>
                                <td>{leave.employee?.user?.name || 'Unknown'}</td>
                                <td>{leave.leave_type}</td>
                                <td>{leave.start_date} to {leave.end_date}</td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
                                        backgroundColor: leave.status === 'approved' ? '#d1fae5' : leave.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                        color: leave.status === 'approved' ? '#065f46' : leave.status === 'rejected' ? '#991b1b' : '#92400e'
                                    }}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td>
                                    {leave.status === 'pending' ? (
                                        <>
                                            <button className="btn btn-sm mr-2" style={{ marginRight: '5px', backgroundColor: '#10b981', color: 'white' }} onClick={() => updateStatus(leave.id, 'approved')}>Approve</button>
                                            <button className="btn btn-danger btn-sm" style={{ marginRight: '5px' }} onClick={() => updateStatus(leave.id, 'rejected')}>Reject</button>
                                        </>
                                    ) : (
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(leave.id)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveManager;
