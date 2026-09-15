import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Contact from '../models/Contact.js';
import Admin from '../models/Admin.js';
import AssociationMember from '../models/AssociationMember.js';
import StaffCoordinator from '../models/StaffCoordinator.js';
import Gallery from '../models/Gallery.js';
import Countdown from '../models/Countdown.js';
import Partner from '../models/Partner.js';
import PaymentQR from '../models/PaymentQR.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const backupDatabase = async (req, res) => {
    try {
        // Fetch all collections in parallel
        const [
            registrations,
            events,
            contacts,
            admins,
            associationMembers,
            staffCoordinators,
            gallery,
            countdown,
            partners,
            paymentQR,
        ] = await Promise.all([
            Registration.find(),
            Event.find(),
            Contact.find(),
            Admin.find().select('-password'),   // Exclude password hashes
            AssociationMember.find(),
            StaffCoordinator.find(),
            Gallery.find(),
            Countdown.find(),
            Partner.find(),
            PaymentQR.find(),
        ]);

        const backup = {
            metadata: {
                timestamp: new Date().toISOString(),
                version: '1.0',
                collections: 10,
            },
            registrations,
            events,
            contacts,
            admins,
            associationMembers,
            staffCoordinators,
            gallery,
            countdown,
            partners,
            paymentQR,
        };

        // Ensure backups directory exists
        const backupsDir = path.join(__dirname, '..', 'backups');
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }

        // Generate timestamped filename
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);       // e.g. 2026-03-10
        const timeStr = now.toISOString().slice(11, 19).replace(/:/g, '-'); // e.g. 22-13-00
        const filename = `backup_${dateStr}_${timeStr}.json`;
        const backupPath = path.join(backupsDir, filename);

        fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

        // Also write a "latest" copy for quick access
        const latestPath = path.join(backupsDir, 'backup_latest.json');
        fs.writeFileSync(latestPath, JSON.stringify(backup, null, 2));

        res.download(backupPath, filename, (err) => {
            if (err) {
                console.error('Backup download error:', err);
                res.status(500).json({ message: 'Backup download failed' });
            }
        });
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({
            message: 'Backup failed',
            error: error.message,
        });
    }
};
