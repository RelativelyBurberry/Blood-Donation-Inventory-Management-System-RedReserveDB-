import React, { useState } from 'react';
import { registerDonor } from '../services/api';

const DonorDashboard = () => {
    const [formData, setFormData] = useState({
        User_id: '', First_Name: '', Last_Name: '', Email: '', Phone_Number: '', 
        Gender: 'Male', DOB: '', Blood_Group: 'A+', Last_Donation_Date: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerDonor(formData);
            alert('Donor Registered Successfully!');
        } catch (err) {
            alert('Error registering donor: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h2>Donor Registration</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="User_id" placeholder="User ID (e.g., U101)" required onChange={handleChange} />
                <input name="First_Name" placeholder="First Name" required onChange={handleChange} />
                <input name="Last_Name" placeholder="Last Name" required onChange={handleChange} />
                <input name="Email" type="email" placeholder="Email" required onChange={handleChange} />
                <input name="Phone_Number" placeholder="Phone Number" required onChange={handleChange} />
                <select name="Gender" onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input name="DOB" type="date" required onChange={handleChange} />
                <select name="Blood_Group" onChange={handleChange}>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <label>Last Donation Date (Leave empty if first time)</label>
                <input name="Last_Donation_Date" type="date" onChange={handleChange} />
                <button type="submit">Register as Donor</button>
            </form>
        </div>
    );
};

export default DonorDashboard;