const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/create", categoryController.addCategory);
router.get("/getAll", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
