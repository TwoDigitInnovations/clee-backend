const express = require("express");
const router = express.Router();

const Location = require("@controllers/locationcontroller");
const auth = require("@middlewares/authMiddleware");

router.post("/create", auth, Location.createLocation);
router.put("/update/:id", auth, Location.updateLocation);
router.get("/getAll", auth, Location.getAllLocations);
router.get("/:id", auth, Location.getLocationById);
router.delete("/delete/:id", auth, Location.deleteLocation);

module.exports = router;
