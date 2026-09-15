import Event from '../models/Event.js';
import mongoose from 'mongoose';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        console.error("Get Events Error:", error);
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }
        const event = await Event.findById(id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error("Get Event Error:", error);
        res.status(500).json({ message: 'Failed to fetch event', error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const event = new Event(req.body);
        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (req.body) {
            Object.assign(event, req.body);
        }

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        console.error("Update Event Error:", error);
        res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed successfully' });
    } catch (error) {
        console.error("Delete Event Error:", error);
        res.status(500).json({ message: 'Failed to delete event', error: error.message });
    }
};
