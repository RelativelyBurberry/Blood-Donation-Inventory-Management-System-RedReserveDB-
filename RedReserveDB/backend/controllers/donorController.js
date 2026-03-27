const pool = require('../config/db');

exports.listDonors = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT d.*, u.First_Name, u.Last_Name, u.Email, u.Phone_Number, u.Gender
             FROM Donor d
             JOIN UserTable u ON d.Donor_id = u.User_id
             ORDER BY u.First_Name`
        );
        return res.json({ success: true, data: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDonor = async (req, res) => {
    const { donorId } = req.params;
    if (req.user?.role === 'Donor' && req.user.linkedId !== donorId) {
        return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    try {
        const [rows] = await pool.query(
            `SELECT d.*, u.First_Name, u.Last_Name, u.Email, u.Phone_Number, u.Gender
             FROM Donor d
             JOIN UserTable u ON d.Donor_id = u.User_id
             WHERE d.Donor_id = ?`, [donorId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Donor not found.' });
        }
        return res.json({ success: true, data: rows[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateDonor = async (req, res) => {
    const { donorId } = req.params;
    const {
        firstName, lastName, email, phoneNumber, gender,
        dob, bloodGroup, lastDonationDate
    } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            `UPDATE UserTable
             SET First_Name = ?, Last_Name = ?, Email = ?, Phone_Number = ?, Gender = ?
             WHERE User_id = ?`,
            [firstName, lastName, email, phoneNumber, gender, donorId]
        );
        await connection.query(
            `UPDATE Donor
             SET DOB = ?, Blood_Group = ?, Last_Donation_Date = ?
             WHERE Donor_id = ?`,
            [dob, bloodGroup, lastDonationDate || null, donorId]
        );

        await connection.commit();
        return res.json({ success: true, message: 'Donor updated.' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};

exports.deleteDonor = async (req, res) => {
    const { donorId } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query('DELETE FROM Donor WHERE Donor_id = ?', [donorId]);
        await connection.query('DELETE FROM UserTable WHERE User_id = ?', [donorId]);
        await connection.commit();
        return res.json({ success: true, message: 'Donor deleted.' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};

exports.getDonationHistory = async (req, res) => {
    const { donorId } = req.params;
    if (req.user?.role === 'Donor' && req.user.linkedId !== donorId) {
        return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    try {
        const [rows] = await pool.query(
            `SELECT Unit_Number, Blood_Group, Collected_Date, Expiry_Date, Status
             FROM Blood_Unit
             WHERE Donor_id = ?
             ORDER BY Collected_Date DESC`, [donorId]
        );
        return res.json({ success: true, data: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
