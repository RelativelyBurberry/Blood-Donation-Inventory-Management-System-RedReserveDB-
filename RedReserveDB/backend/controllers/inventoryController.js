const pool = require('../config/db');

const generateUnitNumber = () => {
    const suffix = Math.random().toString(36).slice(2, 4).toUpperCase();
    return `BU${Date.now().toString().slice(-6)}${suffix}`;
};

const isPastDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};

exports.listUnits = async (req, res) => {
    const { status, bloodGroup, expiringInDays } = req.query;
    const filters = [];
    const params = [];

    if (status) {
        filters.push('Status = ?');
        params.push(status);
    }
    if (bloodGroup) {
        filters.push('Blood_Group = ?');
        params.push(bloodGroup);
    }
    if (expiringInDays) {
        filters.push('Expiry_Date <= DATE_ADD(CURRENT_DATE, INTERVAL ? DAY)');
        params.push(Number(expiringInDays));
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    try {
        const [rows] = await pool.query(
            `SELECT Unit_Number, Blood_Group, Expiry_Date, Status, Hospital_id, Donor_id, Bank_id, Collected_Date
             FROM Blood_Unit
             ${where}
             ORDER BY Expiry_Date ASC`, params
        );
        return res.json({ success: true, data: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createUnits = async (req, res) => {
    const { bloodGroup, quantity, expiryDate, donorId, bankId, collectedDate, status } = req.body;
    if (!bloodGroup || !quantity || !expiryDate) {
        return res.status(400).json({ success: false, message: 'bloodGroup, quantity, and expiryDate are required.' });
    }
    if (Number(quantity) < 1) {
        return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }
    if (isPastDate(expiryDate)) {
        return res.status(400).json({ success: false, message: 'Expiry date must be today or later.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const createdUnits = [];
        for (let i = 0; i < Number(quantity); i += 1) {
            const unitNumber = generateUnitNumber();
            await connection.query(
                `INSERT INTO Blood_Unit (Unit_Number, Blood_Group, Expiry_Date, Status, Hospital_id, Donor_id, Bank_id, Collected_Date)
                 VALUES (?, ?, ?, ?, NULL, ?, ?, ?)`,
                [
                    unitNumber,
                    bloodGroup,
                    expiryDate,
                    status || 'Available',
                    donorId || null,
                    bankId || null,
                    collectedDate || null
                ]
            );
            createdUnits.push(unitNumber);
        }

        await connection.commit();
        return res.status(201).json({ success: true, message: 'Blood units added.', data: createdUnits });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};

exports.updateUnit = async (req, res) => {
    const { unitNumber } = req.params;
    const { bloodGroup, expiryDate, status, hospitalId } = req.body;
    if (expiryDate && isPastDate(expiryDate)) {
        return res.status(400).json({ success: false, message: 'Expiry date must be today or later.' });
    }

    try {
        await pool.query(
            `UPDATE Blood_Unit
             SET Blood_Group = COALESCE(?, Blood_Group),
                 Expiry_Date = COALESCE(?, Expiry_Date),
                 Status = COALESCE(?, Status),
                 Hospital_id = COALESCE(?, Hospital_id)
             WHERE Unit_Number = ?`,
            [bloodGroup, expiryDate, status, hospitalId, unitNumber]
        );
        return res.json({ success: true, message: 'Blood unit updated.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteUnit = async (req, res) => {
    const { unitNumber } = req.params;
    try {
        await pool.query('DELETE FROM Blood_Unit WHERE Unit_Number = ?', [unitNumber]);
        return res.json({ success: true, message: 'Blood unit deleted.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.summary = async (req, res) => {
    try {
        const [totalRows] = await pool.query(
            `SELECT COUNT(*) AS totalAvailable
             FROM Blood_Unit
             WHERE Status = 'Available' AND Expiry_Date >= CURRENT_DATE`
        );
        const [groupRows] = await pool.query(
            `SELECT Blood_Group AS bloodGroup, COUNT(*) AS total
             FROM Blood_Unit
             WHERE Status = 'Available' AND Expiry_Date >= CURRENT_DATE
             GROUP BY Blood_Group`
        );
        const [expiringRows] = await pool.query(
            `SELECT Unit_Number, Blood_Group, Expiry_Date
             FROM Blood_Unit
             WHERE Status IN ('Available', 'Reserved')
               AND Expiry_Date <= DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)
             ORDER BY Expiry_Date ASC`
        );
        return res.json({
            success: true,
            data: {
                totalAvailable: totalRows[0]?.totalAvailable || 0,
                byGroup: groupRows,
                expiringSoon: expiringRows
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
