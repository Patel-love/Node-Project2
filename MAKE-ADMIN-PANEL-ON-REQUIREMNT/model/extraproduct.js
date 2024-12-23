const mongoose = require("mongoose");

const extraproductSchema = mongoose.Schema({
 productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "product",
  },
  subproductId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Subproduct",
  },
  extraproductName: {
    type: String,
    required: true,
  },
});

const extraproductModel = mongoose.model("extraproduct", extraproductSchema);

module.exports = extraproductModel;