const bcrypt = require('bcrypt');
const pool = require('../config/db');

const seed = async () => {
    const adminEmail = 'admin@redreserve.com';
    const adminPassword = 'Admin@123';

    const hospitalEmail = 'hospital@redreserve.com';
    const hospitalPassword = 'Hospital@123';

    const donorEmail = 'donor@redreserve.com';
    const donorPassword = 'Donor@123';

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [adminExisting] = await connection.query('SELECT Auth_id FROM Auth_User WHERE Email = ?', [adminEmail]);
        if (adminExisting.length === 0) {
            const hash = await bcrypt.hash(adminPassword, 10);
            await connection.query(
                `INSERT INTO Auth_User (Email, Password_Hash, Role, Linked_Id)
                 VALUES (?, ?, 'Admin', NULL)`,
                [adminEmail, hash]
            );
        }

        const [hospitalExisting] = await connection.query('SELECT Auth_id FROM Auth_User WHERE Email = ?', [hospitalEmail]);
        if (hospitalExisting.length === 0) {
            const hash = await bcrypt.hash(hospitalPassword, 10);
            await connection.query(
                `INSERT INTO Auth_User (Email, Password_Hash, Role, Linked_Id)
                 VALUES (?, ?, 'Hospital', ?)`,
                [hospitalEmail, hash, 'H01']
            );
        }

        const [donorExisting] = await connection.query('SELECT Auth_id FROM Auth_User WHERE Email = ?', [donorEmail]);
        if (donorExisting.length === 0) {
            const hash = await bcrypt.hash(donorPassword, 10);
            await connection.query(
                `INSERT INTO Auth_User (Email, Password_Hash, Role, Linked_Id)
                 VALUES (?, ?, 'Donor', ?)`,
                [donorEmail, hash, 'U01']
            );
        }

        await connection.commit();
        // eslint-disable-next-line no-console
        console.log('Seed completed.');
    } catch (err) {
        await connection.rollback();
        // eslint-disable-next-line no-console
        console.error('Seed failed:', err.message);
    } finally {
        connection.release();
        process.exit(0);
    }
};

seed();
