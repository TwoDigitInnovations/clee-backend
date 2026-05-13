const express = require("express");
const router = express.Router();

const GiftVoucher = require("@controllers/GiftVoucherTemplateController");
const auth = require("@middlewares/authMiddleware");

router.post("/create", auth(), GiftVoucher.createGiftVoucher);
router.put("/update/:id", auth(), GiftVoucher.updateGiftVoucher);
router.get("/getAll", auth(), GiftVoucher.getAllGiftVouchers);
router.get("/:id", auth(), GiftVoucher.getGiftVoucherById);
router.delete("/delete/:id", auth(), GiftVoucher.deleteGiftVoucher);

module.exports = router;
