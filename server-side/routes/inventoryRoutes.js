const express = require("express");
// const authMiddelware = require("../middlewares/authMiddelware");
const {
  createInventoryController,
  getInventoryController
} = require("../controllers/inventoryController");

const router = express.Router();

//routes
// ADD INVENTORY || POST
router.post("/create-inventory", createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", getInventoryController);

module.exports = router;
