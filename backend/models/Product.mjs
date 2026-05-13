import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  price: {
    standard: { type: Number },
    premium: { type: Number }
  },

  quality: { type: String, default: "Standard" },
  stock: { type: Boolean, default: true },
  image: { type: String },
  category: { type: String, default: "fruit" },
  discount: { type: Number }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);