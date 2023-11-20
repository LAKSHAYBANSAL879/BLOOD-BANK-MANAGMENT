const express = require("express");
// const authMiddelware = require("../middlewares/authMiddelware");
const {
  createInventoryController,
  getInventoryController,
  getTopDonorsController
} = require("../controllers/inventoryController");

const router = express.Router();

//routes
// ADD INVENTORY || POST
router.post("/create-inventory", createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", getInventoryController);
 router.get("/top-donar",getTopDonorsController);
module.exports = router;
