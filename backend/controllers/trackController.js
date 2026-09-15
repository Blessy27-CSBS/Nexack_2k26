import Track from '../models/Track.js';
import { processFileUpload } from '../middleware/uploadMiddleware.js';

// Public: Get published tracks
export const getPublishedTracks = async (req, res) => {
  try {
    const tracks = await Track.find({ status: 'Published' }).sort({ displayOrder: 1, trackNumber: 1 });
    res.json({ success: true, count: tracks.length, tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: Get track details
export const getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track || track.status !== 'Published') {
      return res.status(404).json({ success: false, message: 'Track not found or not published' });
    }
    res.json({ success: true, track });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all tracks
export const getAllTracksAdmin = async (req, res) => {
  try {
    const tracks = await Track.find().sort({ displayOrder: 1, trackNumber: 1 });
    res.json({ success: true, count: tracks.length, tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create Track
export const createTrack = async (req, res) => {
  try {
    const {
      trackNumber,
      title,
      shortDescription,
      detailedDescription,
      problemAreas,
      suggestedTechnologies,
      icon,
      displayOrder,
      status
    } = req.body;

    let bannerImage = req.body.bannerImage || '';
    if (req.file) {
      const uploadResult = await processFileUpload(req.file, 'tracks');
      bannerImage = uploadResult.url;
    }

    const parsedProblemAreas = typeof problemAreas === 'string' 
      ? problemAreas.split(',').map(s => s.trim()).filter(Boolean) 
      : (problemAreas || []);

    const parsedSuggestedTech = typeof suggestedTechnologies === 'string'
      ? suggestedTechnologies.split(',').map(s => s.trim()).filter(Boolean)
      : (suggestedTechnologies || []);

    const track = await Track.create({
      trackNumber: Number(trackNumber) || 1,
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      detailedDescription: detailedDescription || '',
      problemAreas: parsedProblemAreas,
      suggestedTechnologies: parsedSuggestedTech,
      icon: icon || 'Cpu',
      bannerImage,
      displayOrder: Number(displayOrder) || 0,
      status: status || 'Published'
    });

    res.status(201).json({ success: true, message: 'Track created successfully', track });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update Track
export const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Track not found' });
    }

    const {
      trackNumber,
      title,
      shortDescription,
      detailedDescription,
      problemAreas,
      suggestedTechnologies,
      icon,
      displayOrder,
      status
    } = req.body;

    if (trackNumber !== undefined) track.trackNumber = Number(trackNumber);
    if (title) track.title = title.trim();
    if (shortDescription) track.shortDescription = shortDescription.trim();
    if (detailedDescription !== undefined) track.detailedDescription = detailedDescription;
    if (icon) track.icon = icon;
    if (displayOrder !== undefined) track.displayOrder = Number(displayOrder);
    if (status) track.status = status;

    if (problemAreas !== undefined) {
      track.problemAreas = typeof problemAreas === 'string'
        ? problemAreas.split(',').map(s => s.trim()).filter(Boolean)
        : problemAreas;
    }

    if (suggestedTechnologies !== undefined) {
      track.suggestedTechnologies = typeof suggestedTechnologies === 'string'
        ? suggestedTechnologies.split(',').map(s => s.trim()).filter(Boolean)
        : suggestedTechnologies;
    }

    if (req.file) {
      const uploadResult = await processFileUpload(req.file, 'tracks');
      track.bannerImage = uploadResult.url;
    }

    await track.save();
    res.json({ success: true, message: 'Track updated successfully', track });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete Track
export const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;
    await Track.findByIdAndDelete(id);
    res.json({ success: true, message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
