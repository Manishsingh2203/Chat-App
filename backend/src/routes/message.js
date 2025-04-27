const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

router.get("/unread-counts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const counts = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(userId), unread: true } },
      { $group: { _id: "$sender", count: { $sum: 1 } } }
    ]);

    const result = {};
    counts.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch unread counts");
  }
});

module.exports = router;
