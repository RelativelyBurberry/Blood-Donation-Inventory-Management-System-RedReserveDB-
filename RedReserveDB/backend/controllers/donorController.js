const pool = require('../config/db');

exports.registerDonor = async (req, res) => {
    const { User_id, First_Name, Last_Name, Email, Phone_Number, Gender, DOB, Blood_Group, Last_Donation_Date } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert into common UserTable
        await connection.query(
            `INSERT INTO UserTable (User_id, First_Name, Last_Name, Email, Phone_Number, Gender) VALUES (?, ?, ?, ?, ?, ?)`,
            [User_id, First_Name, Last_Name, Email, Phone_Number, Gender]
        );

        // 2. Insert into specialized Donor table
        await connection.query(
            `INSERT INTO Donor (Donor_id, DOB, Blood_Group, Last_Donation_Date) VALUES (?, ?, ?, ?)`,
            [User_id, DOB, Blood_Group, Last_Donation_Date || null]
        );

        await connection.commit();
        res.status(201).json({ success: true, message: 'Donor registered successfully!' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ success: false, error: err.message });
    } finally {
        connection.release();
    }
};