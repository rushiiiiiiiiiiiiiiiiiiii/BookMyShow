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

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
