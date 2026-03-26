const pool = require('../config/db');

exports.login = async (req, res) => {
    const { role, id } = req.body;

    try {
        if (role === 'Admin') {
            if (id === 'ADMIN123') return res.json({ success: true, role: 'Admin', id });
        } 
        else if (role === 'Hospital') {
            const [rows] = await pool.query('SELECT * FROM Hospital WHERE Hospital_id = ?', [id]);
            if (rows.length > 0) return res.json({ success: true, role: 'Hospital', data: rows[0] });
        } 
        else if (role === 'Donor') {
            const [rows] = await pool.query(
                `SELECT d.*, u.First_Name, u.Last_Name, u.Email 
                 FROM Donor d 
                 JOIN UserTable u ON d.Donor_id = u.User_id 
                 WHERE d.Donor_id = ?`, [id]
            );
            if (rows.length > 0) return res.json({ success: true, role: 'Donor', data: rows[0] });
        }
        res.status(401).json({ success: false, message: 'Invalid ID for the selected role.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};