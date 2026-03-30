const express = require("express");
const router = express.Router();

const Resource = require("@controllers/resourceController");
const auth = require("@middlewares/authMiddleware");

router.post("/create", auth('admin'), Resource.createResource);
router.put("/update/:id", auth('admin'), Resource.updateResource);
router.get("/getAll", auth('admin'), Resource.getAllResources);
router.get("/:id", auth('admin'), Resource.getResourceById);
router.delete("/delete/:id", auth('admin'), Resource.deleteResource);

module.exports = router;
