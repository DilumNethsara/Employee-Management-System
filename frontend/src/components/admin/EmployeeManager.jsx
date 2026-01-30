import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmp, setEditingEmp] = useState(null);
    const { signup } = useAuth(); // Need to create Auth user if adding new employee?

    // Form Data
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', // detailed for new user
        department_id: '', role: '', phone: '', joining_date: '', salary: ''
    });

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error("Failed to fetch employees", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmp) {
                // Editing existing employee -> PUT /employees/:id
                await api.put(`/employees/${editingEmp.id}`, {
                    department_id: formData.department_id,
                    role: formData.role,
                    phone: formData.phone,
                    joining_date: formData.joining_date,
                    salary: formData.salary
                });
            } else {
                // Creating new employee -> 1. Register User, 2. Create Employee record
                // Using helper API logic or manual.
                const registerRes = await api.post('/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'employee'
                });

                const userId = registerRes.data.user.id;

                await api.post('/employees', {
                    user_id: userId,
                    department_id: formData.department_id,
                    role: formData.role,
                    phone: formData.phone,
                    joining_date: formData.joining_date,
                    salary: formData.salary
                });
            }
            setIsModalOpen(false);
            setEditingEmp(null);
            fetchEmployees();
        } catch (error) {
            alert('Operation failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This likely deletes the employee record, but not the user account (or cascade?). Validation needed.')) return;
        // Check cascade.
        try {
            await api.delete(`/employees/${id}`);
            fetchEmployees();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const openEdit = (emp) => {
        setEditingEmp(emp);
        setFormData({
            name: emp.user.name,
            email: emp.user.email,
            department_id: emp.department_id,
            role: emp.role,
            phone: emp.phone,
            joining_date: emp.joining_date,
            salary: emp.salary,
            password: '' // can't edit password here easily
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingEmp(null);
        setFormData({
            name: '', email: '', password: '',
            department_id: '', role: '', phone: '', joining_date: '', salary: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3>Employees</h3>
                <button className="btn btn-primary" onClick={openAdd}>Add Employee</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.user?.name}</td>
                                <td>{emp.department?.name}</td>
                                <td>{emp.role}</td>
                                <td>{emp.phone}</td>
                                <td>${emp.salary}</td>
                                <td>
                                    <button className="btn btn-sm mr-2" style={{ marginRight: '5px' }} onClick={() => openEdit(emp)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h4>{editingEmp ? 'Edit' : 'Add'} Employee</h4>
                        <form onSubmit={handleSubmit}>
                            {!editingEmp && (
                                <>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                                    </div>
                                </>
                            )}

                            {/* Edit Fields */}
                            <div className="form-group">
                                <label>Department</label>
                                <select value={formData.department_id} onChange={e => setFormData({ ...formData, department_id: e.target.value })} required>
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Job Role</label>
                                <input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Joining Date</label>
                                <input type="date" value={formData.joining_date} onChange={e => setFormData({ ...formData, joining_date: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Salary</label>
                                <input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} required />
                            </div>

                            <div className="flex justify-between mt-4">
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManager;
