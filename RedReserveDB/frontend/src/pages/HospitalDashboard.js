import React, { useState } from 'react';
import { requestBlood } from '../services/api';

const HospitalDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({
        Request_id: '', Blood_Group: 'A+', Quantity: 1, 
        Hospital_id: user?.data?.Hospital_id || '', Patient_id: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await requestBlood(formData);
            alert('Blood Request Submitted Successfully!');
        } catch (err) {
            alert('Error submitting request: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h2>Request Blood Units</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="Request_id" placeholder="Request ID (e.g., R001)" required onChange={handleChange} />
                <select name="Blood_Group" onChange={handleChange}>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <input name="Quantity" type="number" min="1" placeholder="Quantity (Units)" required onChange={handleChange} />
                <input name="Hospital_id" placeholder="Hospital ID" value={formData.Hospital_id} required onChange={handleChange} />
                <input name="Patient_id" placeholder="Patient ID (e.g., P101)" required onChange={handleChange} />
                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
};

export default HospitalDashboard;