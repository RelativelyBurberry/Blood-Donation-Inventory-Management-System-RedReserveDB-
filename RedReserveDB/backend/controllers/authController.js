const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const createToken = (user) => {
    return jwt.sign(
        { authId: user.Auth_id, role: user.Role, email: user.Email, linkedId: user.Linked_Id },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM Auth_User WHERE Email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.Password_Hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        let profile = null;
        if (user.Role === 'Donor') {
            const [rows] = await pool.query(
                `SELECT d.*, u.First_Name, u.Last_Name, u.Email, u.Phone_Number, u.Gender
                 FROM Donor d
                 JOIN UserTable u ON d.Donor_id = u.User_id
                 WHERE d.Donor_id = ?`, [user.Linked_Id]
            );
            profile = rows[0] || null;
        }
        if (user.Role === 'Hospital') {
            const [rows] = await pool.query('SELECT * FROM Hospital WHERE Hospital_id = ?', [user.Linked_Id]);
            profile = rows[0] || null;
        }

        const token = createToken(user);
        return res.json({
            success: true,
            token,
            user: { role: user.Role, email: user.Email, linkedId: user.Linked_Id, profile }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.registerDonor = async (req, res) => {
    const {
        userId, firstName, lastName, email, phoneNumber, gender,
        dob, bloodGroup, lastDonationDate, password
    } = req.body;

    if (!userId || !firstName || !lastName || !email || !phoneNumber || !gender || !dob || !bloodGroup || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT Auth_id FROM Auth_User WHERE Email = ?', [email]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        await connection.query(
            `INSERT INTO UserTable (User_id, First_Name, Last_Name, Email, Phone_Number, Gender)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, firstName, lastName, email, phoneNumber, gender]
        );
        await connection.query(
            `INSERT INTO Donor (Donor_id, DOB, Blood_Group, Last_Donation_Date)
             VALUES (?, ?, ?, ?)`,
            [userId, dob, bloodGroup, lastDonationDate || null]
        );

        const hash = await bcrypt.hash(password, 10);
        await connection.query(
            `INSERT INTO Auth_User (Email, Password_Hash, Role, Linked_Id)
             VALUES (?, ?, 'Donor', ?)`,
            [email, hash, userId]
        );

        await connection.commit();
        return res.status(201).json({ success: true, message: 'Donor registered successfully.' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};

exports.registerHospital = async (req, res) => {
    const { hospitalId, name, address, contactNumber, email, password } = req.body;
    if (!hospitalId || !name || !address || !contactNumber || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT Auth_id FROM Auth_User WHERE Email = ?', [email]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        await connection.query(
            `INSERT INTO Hospital (Hospital_id, Name, Address, Contact_Number)
             VALUES (?, ?, ?, ?)`,
            [hospitalId, name, address, contactNumber]
        );

        const hash = await bcrypt.hash(password, 10);
        await connection.query(
            `INSERT INTO Auth_User (Email, Password_Hash, Role, Linked_Id)
             VALUES (?, ?, 'Hospital', ?)`,
            [email, hash, hospitalId]
        );

        await connection.commit();
        return res.status(201).json({ success: true, message: 'Hospital registered successfully.' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};

exports.me = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM Auth_User WHERE Auth_id = ?', [req.user.authId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = users[0];
        let profile = null;
        if (user.Role === 'Donor') {
            const [rows] = await pool.query(
                `SELECT d.*, u.First_Name, u.Last_Name, u.Email, u.Phone_Number, u.Gender
                 FROM Donor d
                 JOIN UserTable u ON d.Donor_id = u.User_id
                 WHERE d.Donor_id = ?`, [user.Linked_Id]
            );
            profile = rows[0] || null;
        }
        if (user.Role === 'Hospital') {
            const [rows] = await pool.query('SELECT * FROM Hospital WHERE Hospital_id = ?', [user.Linked_Id]);
            profile = rows[0] || null;
        }

        return res.json({ success: true, user: { role: user.Role, email: user.Email, linkedId: user.Linked_Id, profile } });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
