const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    phone: String,

    businessName: String,
    businessType: String,
    businessAddress: String,
    businessCity: String,
    businessPincode: String,

    // onboarding / KYC
    isVerified: { type: Boolean, default: true },

    // admin enforcement (NEW)
    status: {
      type: String,
      enum: ["approved", "blocked"],
      default: "approved",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
