const express = require("express");
const router = express.Router();

const Resource = require("@controllers/resourceController");
const auth = require("@middlewares/authMiddleware");

router.post("/create", auth(), Resource.createResource);
router.put("/update/:id", auth(), Resource.updateResource);
router.get("/getAll", auth(), Resource.getAllResources);
router.get("/:id", auth(), Resource.getResourceById);
router.delete("/delete/:id", auth(), Resource.deleteResource);

module.exports = router;
