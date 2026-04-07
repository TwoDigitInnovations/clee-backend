const express = require("express");
const router = express.Router();

const GiftVoucher = require("@controllers/GiftVoucherTemplateController");
const auth = require("@middlewares/authMiddleware");

router.post("/create", auth('admin'), GiftVoucher.createGiftVoucher);
router.put("/update/:id", auth('admin'), GiftVoucher.updateGiftVoucher);
router.get("/getAll", auth('admin'), GiftVoucher.getAllGiftVouchers);
router.get("/:id", auth('admin'), GiftVoucher.getGiftVoucherById);
router.delete("/delete/:id", auth('admin'), GiftVoucher.deleteGiftVoucher);

module.exports = router;
