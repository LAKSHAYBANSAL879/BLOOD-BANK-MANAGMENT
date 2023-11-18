const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is needed"],
    },
    inventoryType: {
      type: String,
      required: [true, "inventory type require"],
      enum: ["in", "out"],
    },
    phone:Number,
    bloodGroup: {
      type: String,
      required: [true, "blood group is require"],
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-","A","B"],
    },
    quantity: {
      type: Number,
      required: [true, "blood quantity is required"],
    },
    email: {
      type: String,
      required: [true, "Donor Email is Required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);

