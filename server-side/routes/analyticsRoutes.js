const express = require("express");
// const authMiddelware = require("../middlewares/authMiddelware");
const {
  bloodGroupDetailsContoller,
} = require("../controllers/analyticsController");

const router = express.Router();

//routes

//GET BLOOD DATA
router.get("/bloodGroups-data/:hospitalName", bloodGroupDetailsContoller);

module.exports = router;
