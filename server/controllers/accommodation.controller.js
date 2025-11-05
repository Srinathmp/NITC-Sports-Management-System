const Accommodation = require("../models/accommodation.model");

exports.getAllAccommodations = async (req, res) => {
  try {
    // No populate needed now
    const accommodations = await Accommodation.find().sort({ createdAt: -1 });

    res.status(200).json(accommodations);
  } catch (err) {
    console.error("Error fetching accommodations:", err.message);
    res.status(500).json({ error: "Failed to fetch accommodations" });
  }
};


exports.addAccommodation = async (req, res) => {
  try {
    const accommodation = new Accommodation(req.body);
    await accommodation.save();
    res.status(201).json(accommodation);
  } catch (err) {
    res.status(400).json({ error: "Error creating accommodation"+err });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(accommodation);
  } catch (err) {
    res.status(400).json({ error: "Error updating accommodation"});
  }
};
