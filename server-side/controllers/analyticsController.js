
const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");

const bloodGroupDetailsContoller = async (req, res) => {
  try {
    const hospitalName = req.params.hospitalName; // Extract the hospital name from the request parameters
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupData = [];

    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        // Count TOTAL IN
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              name: hospitalName, // Match by hospital name
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        // Count TOTAL OUT
        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              name: hospitalName, // Match by hospital name
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        // CALCULATE TOTAL
        const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        // PUSH DATA
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          availableBlood,
        });
      })
    );

    return res.status(200).send({
      success: true,
      message: `Blood Group Data Analytics for ${hospitalName}`,
      hospitalBloodData: [
        {
          hospitalName,
          bloodGroupData,
        },
      ],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Bloodgroup Data Analytics API",
      error,
    });
  }
};

module.exports = { bloodGroupDetailsContoller };
