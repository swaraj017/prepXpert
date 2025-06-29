const express = require("express");
const router = express.Router();
const Journey = require("../models/Journey");
const { requireAuth } = require('@clerk/clerk-sdk-node');

router.post("/create", requireAuth, async (req, res) => {
  console.log(" POST /create called");
  console.log("  Auth:", req.auth);
  console.log("  Request body:", req.body);
  
  const userId = req.auth?.userId;
  
  if (!userId) {
    console.log("  No userId found in req.auth");
    return res.status(401).json({ error: "Unauthorized - No user ID" });
  }
  
  const { role, experience, stack, description } = req.body;
  
  // Validate required fields
  if (!role || !experience || !stack || !description) {
    console.log("  Missing required fields");
    return res.status(400).json({ 
      error: "Missing required fields",
      received: { role, experience, stack, description }
    });
  }
  
  try {
    console.log("  Creating journey with data:", {
      userId,
      role,
      experience,
      stack,
      description,
    });
    
    const journey = await Journey.create({
      userId,
      role,
      experience,
      stack,
      description,
    });
    
    console.log("  Journey created successfully:", journey);
    res.status(201).json(journey);
  } catch (err) {
    console.error("  Database error:", err);
    res.status(500).json({ 
      error: "Failed to create journey",
      details: err.message 
    });
  }
});

//   Get All Journeys
router.get("/", requireAuth, async (req, res) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthorized - No user" });
  }
  
  try {
    const journeys = await Journey.find({ userId: req.auth.userId });
    console.log(`  Found ${journeys.length} journeys for user ${req.auth.userId}`);
    res.status(200).json(journeys);
  } catch (err) {
    console.error("Error fetching journeys", err);
    res.status(500).json({ error: "Error fetching journeys" });
  }
});

//   Update Journey
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.userId;
  const { role, experience, stack, description } = req.body;
  
  try {
    const journey = await Journey.findOne({ _id: id, userId });
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found or unauthorized' });
    }
    
    journey.role = role || journey.role;
    journey.experience = experience || journey.experience;
    journey.stack = stack || journey.stack;
    journey.description = description || journey.description;
    journey.updatedAt = Date.now();
    
    await journey.save();
    res.status(200).json(journey);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update journey' });
  }
});

module.exports = router;