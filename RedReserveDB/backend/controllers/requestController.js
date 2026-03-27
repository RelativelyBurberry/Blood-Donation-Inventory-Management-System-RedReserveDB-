const pool = require('../config/db');

exports.listRequests = async (req, res) => {
    const { status } = req.query;
    const hospitalId = req.user?.role === 'Hospital' ? req.user.linkedId : req.query.hospitalId;
    const filters = [];
    const params = [];

    if (status) {
        filters.push('Status = ?');
        params.push(status);
    }
    if (hospitalId) {
        filters.push('Hospital_id = ?');
        params.push(hospitalId);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    try {
        const [rows] = await pool.query(
            `SELECT Request_id, Blood_Group, Quantity, Request_Date, Status, Urgency, Hospital_id, Patient_id,
                    Requested_By, Approved_By, Approved_At, Rejected_At, Fulfilled_At
             FROM Request
             ${where}
             ORDER BY Request_Date DESC`, params
        );
        return res.json({ success: true, data: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createRequest = async (req, res) => {
    const { requestId, bloodGroup, quantity, patientId, urgency } = req.body;
    const hospitalId = req.user?.role === 'Hospital' ? req.user.linkedId : req.body.hospitalId;
    if (!requestId || !bloodGroup || !quantity || !hospitalId || !patientId) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    if (Number(quantity) < 1) {
        return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    const requestDate = new Date().toISOString().split('T')[0];
    const status = 'Pending';

    try {
        await pool.query(
            `INSERT INTO Request
             (Request_id, Blood_Group, Quantity, Request_Date, Status, Urgency, Hospital_id, Patient_id, Requested_By)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [requestId, bloodGroup, quantity, requestDate, status, urgency || 'Medium', hospitalId, patientId, req.user?.authId || null]
        );
        return res.status(201).json({ success: true, message: 'Blood request submitted.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.approveRequest = async (req, res) => {
    const { requestId } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [requests] = await connection.query('SELECT * FROM Request WHERE Request_id = ?', [requestId]);
        if (requests.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Request not found.' });
        }

        const request = requests[0];
        if (request.Status !== 'Pending') {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Request is not pending.' });
        }

        const [units] = await connection.query(
            `SELECT Unit_Number
             FROM Blood_Unit
             WHERE Blood_Group = ?
               AND Status = 'Available'
               AND Expiry_Date >= CURRENT_DATE
             ORDER BY Expiry_Date ASC
             LIMIT ?`,
            [request.Blood_Group, request.Quantity]
        );

        if (units.length < request.Quantity) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Not enough inventory to approve.' });
        }

        for (const unit of units) {
            await connection.query(
                `UPDATE Blood_Unit
                 SET Status = 'Reserved', Hospital_id = ?
                 WHERE Unit_Number = ?`,
                [request.Hospital_id, unit.Unit_Number]
            );
            await connection.query(
                `INSERT INTO Request_Unit (Request_id, Unit_Number)
                 VALUES (?, ?)`,
                [request.Request_id, unit.Unit_Number]
            );
        }

        await connection.query(
            `UPDATE Request
             SET Status = 'Approved', Approved_By = ?, Approved_At = NOW()
             WHERE Request_id = ?`,
            [req.user?.authId || null, request.Request_id]
        );

        await connection.commit();
        return res.json({ success: true, message: 'Request approved and inventory reserved.' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};

exports.rejectRequest = async (req, res) => {
    const { requestId } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [requests] = await connection.query('SELECT * FROM Request WHERE Request_id = ?', [requestId]);
        if (requests.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Request not found.' });
        }

        const request = requests[0];
        if (request.Status === 'Rejected') {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Request already rejected.' });
        }

        const [reserved] = await connection.query(
            `SELECT Unit_Number FROM Request_Unit WHERE Request_id = ?`,
            [requestId]
        );
        if (reserved.length > 0) {
            for (const unit of reserved) {
                await connection.query(
                    `UPDATE Blood_Unit
                     SET Status = 'Available', Hospital_id = NULL
                     WHERE Unit_Number = ?`,
                    [unit.Unit_Number]
                );
            }
            await connection.query('DELETE FROM Request_Unit WHERE Request_id = ?', [requestId]);
        }

        await connection.query(
            `UPDATE Request
             SET Status = 'Rejected', Rejected_At = NOW()
             WHERE Request_id = ?`,
            [requestId]
        );

        await connection.commit();
        return res.json({ success: true, message: 'Request rejected.' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};

exports.fulfillRequest = async (req, res) => {
    const { requestId } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [requests] = await connection.query('SELECT * FROM Request WHERE Request_id = ?', [requestId]);
        if (requests.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Request not found.' });
        }

        const request = requests[0];
        if (request.Status !== 'Approved') {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Only approved requests can be fulfilled.' });
        }

        const [reserved] = await connection.query(
            `SELECT Unit_Number FROM Request_Unit WHERE Request_id = ?`,
            [requestId]
        );
        for (const unit of reserved) {
            await connection.query(
                `UPDATE Blood_Unit
                 SET Status = 'Used'
                 WHERE Unit_Number = ?`,
                [unit.Unit_Number]
            );
        }

        await connection.query(
            `UPDATE Request
             SET Status = 'Fulfilled', Fulfilled_At = NOW()
             WHERE Request_id = ?`,
            [requestId]
        );

        await connection.commit();
        return res.json({ success: true, message: 'Request fulfilled.' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        connection.release();
    }
};
