import Countdown from '../models/Countdown.js';
import mongoose from 'mongoose';

export const getCountdown = async (req, res) => {
    try {
        const countdown = await Countdown.findOne().sort({ createdAt: -1 });
        if (countdown) {
            // Explicitly return targetDate as ISO string for safe frontend parsing
            res.json({
                _id: countdown._id,
                title: countdown.title,
                targetDate: countdown.targetDate instanceof Date
                    ? countdown.targetDate.toISOString()
                    : new Date(countdown.targetDate).toISOString(),
                createdAt: countdown.createdAt,
                updatedAt: countdown.updatedAt,
            });
        } else {
            res.status(404).json({ message: 'No countdown found' });
        }
    } catch (error) {
        console.error("Get Countdown Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createCountdown = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        const { title, targetDate } = req.body;

        if (!title || !targetDate) {
            return res.status(400).json({ message: 'Title and target date are required' });
        }

        const parsedDate = new Date(targetDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format for targetDate' });
        }

        // Remove existing countdowns to keep only one active
        await Countdown.deleteMany({});

        const countdown = new Countdown({ title, targetDate: parsedDate });
        const createdCountdown = await countdown.save();

        res.status(201).json({
            _id: createdCountdown._id,
            title: createdCountdown.title,
            targetDate: createdCountdown.targetDate.toISOString(),
            createdAt: createdCountdown.createdAt,
            updatedAt: createdCountdown.updatedAt,
        });
    } catch (error) {
        console.error("Create Countdown Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateCountdown = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid countdown ID' });
        }

        const { title, targetDate } = req.body || {};
        const countdown = await Countdown.findById(id);

        if (!countdown) {
            return res.status(404).json({ message: 'Countdown not found' });
        }

        if (title) countdown.title = title;

        if (targetDate) {
            const parsedDate = new Date(targetDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: 'Invalid date format for targetDate' });
            }
            countdown.targetDate = parsedDate;
        }

        const updatedCountdown = await countdown.save();

        res.json({
            _id: updatedCountdown._id,
            title: updatedCountdown.title,
            targetDate: updatedCountdown.targetDate.toISOString(),
            createdAt: updatedCountdown.createdAt,
            updatedAt: updatedCountdown.updatedAt,
        });
    } catch (error) {
        console.error("Update Countdown Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteCountdown = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid countdown ID' });
        }

        const countdown = await Countdown.findById(id);

        if (!countdown) {
            return res.status(404).json({ message: 'Countdown not found' });
        }

        await countdown.deleteOne();
        res.json({ message: 'Countdown removed' });
    } catch (error) {
        console.error("Delete Countdown Error:", error);
        res.status(500).json({ message: error.message });
    }
};
