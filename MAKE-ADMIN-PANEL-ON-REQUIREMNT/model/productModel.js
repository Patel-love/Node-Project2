const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product: { type: "string", required: true },
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;