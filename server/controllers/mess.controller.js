const Mess = require("../models/mess.model");

exports.getAllMess = async (req, res) => {
  try {
    const data = await Mess.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mess data" });
  }
};

exports.addMess = async (req, res) => {
  try {
    const { mess_name, capacity_per_meal, location, remarks } = req.body;

    if (!mess_name || !capacity_per_meal || !location) {
      return res.status(400).json({ error: "Mess name, capacity, and location are required." });
    }

    const mess = new Mess({
      mess_name: mess_name.trim(),
      capacity_per_meal: Number(capacity_per_meal),
      location: location.trim(),
      remarks: remarks || "",
    });

    await mess.save();
    res.status(201).json(mess);
  } catch (err) {
    console.error("Error creating mess entry:", err.message);
    res.status(500).json({ error: "Error creating mess entry" });
  }
};


exports.updateMess = async (req, res) => {
  try {
    const mess = await Mess.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(mess);
  } catch (err) {
    res.status(400).json({ error: "Error updating mess entry" });
  }
};