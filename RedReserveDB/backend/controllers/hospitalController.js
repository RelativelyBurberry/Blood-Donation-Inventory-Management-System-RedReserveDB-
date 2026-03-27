const pool = require('../config/db');

exports.listHospitals = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Hospital ORDER BY Name');
        return res.json({ success: true, data: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateHospital = async (req, res) => {
    const { hospitalId } = req.params;
    const { name, address, contactNumber } = req.body;
    try {
        await pool.query(
            `UPDATE Hospital
             SET Name = COALESCE(?, Name),
                 Address = COALESCE(?, Address),
                 Contact_Number = COALESCE(?, Contact_Number)
             WHERE Hospital_id = ?`,
            [name, address, contactNumber, hospitalId]
        );
        return res.json({ success: true, message: 'Hospital updated.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteHospital = async (req, res) => {
    const { hospitalId } = req.params;
    try {
        await pool.query('DELETE FROM Hospital WHERE Hospital_id = ?', [hospitalId]);
        return res.json({ success: true, message: 'Hospital deleted.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
