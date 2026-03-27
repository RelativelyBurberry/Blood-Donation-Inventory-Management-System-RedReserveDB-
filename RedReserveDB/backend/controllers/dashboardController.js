const pool = require('../config/db');

exports.getSummary = async (req, res) => {
    try {
        const [inventoryTotals] = await pool.query(
            `SELECT COUNT(*) AS totalAvailable
             FROM Blood_Unit
             WHERE Status = 'Available' AND Expiry_Date >= CURRENT_DATE`
        );

        const [byGroup] = await pool.query(
            `SELECT Blood_Group AS bloodGroup, COUNT(*) AS total
             FROM Blood_Unit
             WHERE Status = 'Available' AND Expiry_Date >= CURRENT_DATE
             GROUP BY Blood_Group`
        );

        const [requestStatus] = await pool.query(
            `SELECT Status AS status, COUNT(*) AS total
             FROM Request
             GROUP BY Status`
        );

        const [expiringSoon] = await pool.query(
            `SELECT Unit_Number, Blood_Group, Expiry_Date
             FROM Blood_Unit
             WHERE Status IN ('Available', 'Reserved')
               AND Expiry_Date <= DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)
             ORDER BY Expiry_Date ASC`
        );

        const [usageDaily] = await pool.query(
            `SELECT DATE(Fulfilled_At) AS day, COUNT(*) AS total
             FROM Request
             WHERE Fulfilled_At IS NOT NULL
               AND Fulfilled_At >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
             GROUP BY DATE(Fulfilled_At)
             ORDER BY day ASC`
        );

        return res.json({
            success: true,
            data: {
                totalAvailable: inventoryTotals[0]?.totalAvailable || 0,
                byGroup,
                requestStatus,
                expiringSoon,
                usageDaily
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
