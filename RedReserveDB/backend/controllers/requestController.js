const pool = require('../config/db');

exports.createRequest = async (req, res) => {
    const { Request_id, Blood_Group, Quantity, Hospital_id, Patient_id } = req.body;
    const Request_Date = new Date().toISOString().split('T')[0];
    const Status = 'Pending';

    try {
        await pool.query(
            `INSERT INTO Request (Request_id, Blood_Group, Quantity, Request_Date, Status, Hospital_id, Patient_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [Request_id, Blood_Group, Quantity, Request_Date, Status, Hospital_id, Patient_id]
        );
        res.status(201).json({ success: true, message: 'Blood request submitted successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};