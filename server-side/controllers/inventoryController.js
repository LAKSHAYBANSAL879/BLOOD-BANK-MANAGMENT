const express = require("express");
// const authMiddleware = require("../middlewares/authMiddleware");
const Inventory = require("../models/inventoryModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { bloodGroup, quantity, email,  name, phone, inventoryType,role } = req.body;

    // Check if the user's role is 'donar' or 'hospital'
    // if (role !== 'donar' && role !== 'hospital') {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid user role",
    //   });
    // }

    // Determine the inventoryType based on your logic (action) and update this part accordingly.
    let action = null; // You need to determine the action here.

    // Create a new inventory record
    const inventory = new Inventory({
      name,
      inventoryType, 
      bloodGroup,
      quantity,
      email,
      phone,
      role
    });

    await inventory.save();

    return res.status(201).json({
      success: true,
      message: "New blood inventory record added",
      data: inventory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in create inventory API",
      error: error.message,
    });
  }
};

// GET BLOOD INVENTORY RECORDS WITH FILTER
const getInventoryController = async (req, res) => {
  try {
    // Get query parameters
    let { bloodGroup, search } = req.query;

    // Decode the bloodGroup parameter
    bloodGroup = bloodGroup ? decodeURIComponent(bloodGroup.replace(/\+/g, '%2B')) : bloodGroup;

    // Extract the letter part of the blood group (e.g., from A+ or A-)
    const bloodGroupLetter = bloodGroup ? bloodGroup.slice(0, -1) : bloodGroup;
console.log(bloodGroupLetter);
    // Create a filter object based on query parameters
    const filter = {};
    
    // Filter by blood group letter if specified
    if (bloodGroupLetter) {
      filter.bloodGroup = { $regex: new RegExp(`^${bloodGroupLetter}`, 'i') };
    }

    // Apply additional filtering for the search
    if (search) {
      // Use a case-insensitive regular expression for partial matching
      const searchFilter = {
        $or: [
          { name: { $regex: new RegExp(search, 'i') } },
          { email: { $regex: new RegExp(search, 'i') } },
        ],
      };
      // If bloodGroup filter is already set, combine it with the search filter
      if (filter.$and) {
        filter.$and.push(searchFilter);
      } else {
        filter.$and = [searchFilter];
      }
    }

    // Apply the filter to the query
    const inventory = await Inventory.find(filter).sort({ createdAt: -1 });

    // Separate the records into "in" and "out" types
    const donorList = inventory.filter((record) => record.inventoryType === 'in');
    
    // Filter only records with the specified blood group for the receiver list
    const filteredReceiverList = inventory
      .filter((record) => record.inventoryType === 'out' && (!bloodGroupLetter || record.bloodGroup.startsWith(bloodGroupLetter)));

    return res.status(200).json({
      success: true,
      message: "Blood inventory records retrieved successfully",
      donorList,
      receiverList: filteredReceiverList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in get inventory API",
      error: error.message,
    });
  }
};


const getTopDonorsController = async (req, res) => {
  try {
    
    const topDonors = await Inventory.find({ inventoryType: 'in',role:'individual'})
      .sort({ quantity: -1 }) 
      .limit(10); 

    return res.status(200).json({
      success: true,
      message: "Top donors retrieved successfully",
      data: topDonors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in get top donors API",
      error: error.message,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getTopDonorsController
};
