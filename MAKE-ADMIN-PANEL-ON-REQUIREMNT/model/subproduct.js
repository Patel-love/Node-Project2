const mongoose = require("mongoose");

const subproductSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "product",
  },
  subproductName: {
    type: String,
    required: true,
  },
});

const SubproductModel = mongoose.model("Subproduct", subproductSchema);

module.exports = SubproductModel;