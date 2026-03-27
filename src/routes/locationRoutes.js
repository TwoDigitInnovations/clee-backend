const express = require("express");
const router = express.Router();

const Location = require("@controllers/locationcontroller");
const auth = require("@middlewares/authMiddleware");

router.post("/create", auth('admin'), Location.createLocation);
router.put("/update/:id", auth('admin'), Location.updateLocation);
router.get("/getAll", auth('admin'), Location.getAllLocations);
router.get("/:id", auth('admin'), Location.getLocationById);
router.delete("/delete/:id", auth('admin'), Location.deleteLocation);

module.exports = router;
